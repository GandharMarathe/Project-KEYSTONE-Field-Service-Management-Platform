import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus, Save, Search } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "../components/common/Feedback";
import { useAuth } from "../features/auth/AuthContext";
import { ApiError } from "../services/apiClient";
import { createCustomer, deleteCustomer, getCustomers, toCustomerPayload, updateCustomer } from "../services/customerApi";
import type { BackendCustomer } from "../types/workOrder";

const PAGE_SIZE = 20;
const DELETE_BLOCKED = "This customer cannot be deleted because sites or work orders exist.";

function emptyForm() {
  return { name: "", email: "", phone: "", address: "", active: true };
}

function errorMessage(caught: unknown, fallback: string) {
  if (!(caught instanceof ApiError)) return fallback;
  if (caught.fieldErrors && Object.keys(caught.fieldErrors).length) {
    return Object.values(caught.fieldErrors).join(" ");
  }
  return caught.message || fallback;
}

export function CustomersPage() {
  const { token } = useAuth();
  const client = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BackendCustomer | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [listError, setListError] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const query = useQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomers(token!),
    enabled: Boolean(token),
  });

  const filtered = useMemo(() => {
    const items = query.data ?? [];
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((customer) =>
      customer.name.toLowerCase().includes(q)
      || (customer.email ?? "").toLowerCase().includes(q)
      || (customer.phone ?? "").toLowerCase().includes(q)
    );
  }, [query.data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(0);
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setFormError("");
    setPendingDeleteId(null);
    setShowForm(true);
  }

  function openEdit(customer: BackendCustomer) {
    setEditing(customer);
    setForm({
      name: customer.name,
      email: customer.email ?? "",
      phone: customer.phone ?? "",
      address: customer.address ?? "",
      active: customer.active ?? true,
    });
    setFormError("");
    setPendingDeleteId(null);
    setShowForm(true);
  }

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = toCustomerPayload(form);
      return editing
        ? updateCustomer(editing.id, payload, token!)
        : createCustomer(payload, token!);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["customers"] });
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm());
      setFormError("");
    },
    onError: (caught) => setFormError(errorMessage(caught, "Unable to save customer.")),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCustomer(id, token!),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["customers"] });
      setPendingDeleteId(null);
      setListError("");
    },
    onError: (caught) => {
      if (caught instanceof ApiError && caught.status === 409) {
        setListError(DELETE_BLOCKED);
        return;
      }
      setListError(errorMessage(caught, "Unable to delete customer."));
    },
  });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    if (!form.name.trim()) {
      setFormError("Name is required.");
      return;
    }
    saveMutation.mutate();
  }


  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">OPERATIONS</p>
          <h1>Customers</h1>
          <p>Customers from the API.</p>
        </div>
        <button className="primary-button" type="button" onClick={openCreate}>
          <Plus size={18} />Add Customer
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={submit}>
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
              placeholder="Enter customer name"
              required
            />
          </label>
          <div className="form-grid">
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                placeholder="Email"
              />
            </label>
            <label>
              Phone
              <input
                value={form.phone}
                onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))}
                placeholder="Phone"
              />
            </label>
            <label>
              Active
              <select
                value={form.active ? "true" : "false"}
                onChange={(e) => setForm((current) => ({ ...current, active: e.target.value === "true" }))}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>
          </div>
          <label>
            Address
            <textarea
              value={form.address}
              onChange={(e) => setForm((current) => ({ ...current, address: e.target.value }))}
              placeholder="Address"
              rows={3}
            />
          </label>
          {formError && <p className="form-error" role="alert">{formError}</p>}
          <div className="form-actions">
            <button
              className="text-button"
              type="button"
              onClick={() => { setShowForm(false); setEditing(null); setFormError(""); }}
            >
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={saveMutation.isPending}>
              <Save size={17} />{saveMutation.isPending ? "Saving..." : editing ? "Save Customer" : "Create Customer"}
            </button>
          </div>
        </form>
      )}

      <section className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            aria-label="Search customers"
          />
        </div>
      </section>

      {listError && <p className="form-error" role="alert">{listError}</p>}

      <section className="table-card">
        {query.isLoading ? <LoadingState label="Loading customers..." /> :
          query.isError ? <ErrorState message="Unable to load customers. Please try again." /> :
          !pageItems.length ? <EmptyState message={search ? "No customers match your filters." : "No customers available."} /> : (
            <>
              <div className="data-table">
                <div className="table-row table-header">
                  <span>Customer</span>
                  <span>Email</span>
                  <span>Phone</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
                {pageItems.map((customer) => (
                  <div className="table-row" key={customer.id}>
                    <span>
                      <strong>{customer.name}</strong>
                      <small>{customer.address || "No address"}</small>
                    </span>
                    <span>{customer.email || "—"}</span>
                    <span>{customer.phone || "—"}</span>
                    <span><span className="priority">{customer.active === false ? "INACTIVE" : "ACTIVE"}</span></span>
                    <span>
                      {pendingDeleteId === customer.id ? (
                        <>
                          <button
                            className="text-button"
                            type="button"
                            onClick={() => deleteMutation.mutate(customer.id)}
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? "Deleting..." : "Confirm"}
                          </button>
                          <button className="text-button" type="button" onClick={() => setPendingDeleteId(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="text-button" type="button" onClick={() => openEdit(customer)}>Edit</button>
                          <button className="text-button" type="button" onClick={() => setPendingDeleteId(customer.id)}>Delete</button>
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="table-footer">
                <span>Page {page + 1} of {totalPages} · {filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
                <div>
                  <button className="icon-button" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} aria-label="Previous page"><ChevronLeft /></button>
                  <button className="icon-button" onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages} aria-label="Next page"><ChevronRight /></button>
                </div>
              </div>
            </>
          )}
      </section>
    </div>
  );
}
