import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus, Save, Search } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "../components/common/Feedback";
import { useAuth } from "../features/auth/AuthContext";
import { ApiError } from "../services/apiClient";
import { getCustomers } from "../services/customerApi";
import { createSite, deleteSite, getSites, toCreateSitePayload, toUpdateSitePayload, updateSite } from "../services/siteApi";
import type { BackendSite } from "../types/workOrder";

const PAGE_SIZE = 20;
const DELETE_BLOCKED = "This site cannot be deleted because work orders exist.";

function emptyForm() {
  return {
    customerId: "" as number | "",
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    active: true,
  };
}

function errorMessage(caught: unknown, fallback: string) {
  if (!(caught instanceof ApiError)) return fallback;
  if (caught.fieldErrors && Object.keys(caught.fieldErrors).length) {
    return Object.values(caught.fieldErrors).join(" ");
  }
  return caught.message || fallback;
}

export function SitesPage() {
  const { token } = useAuth();
  const client = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [customerFilter, setCustomerFilter] = useState<number | "">("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BackendSite | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [listError, setListError] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const query = useQuery({
    queryKey: ["sites"],
    queryFn: () => getSites(token!),
    enabled: Boolean(token),
  });

  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomers(token!),
    enabled: Boolean(token),
  });

  const filtered = useMemo(() => {
    let items = query.data ?? [];
    if (customerFilter) items = items.filter((site) => site.customer?.id === customerFilter);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((site) =>
        site.name.toLowerCase().includes(q)
        || (site.city ?? "").toLowerCase().includes(q)
        || (site.addressLine1 ?? "").toLowerCase().includes(q)
        || (site.customer?.name ?? "").toLowerCase().includes(q)
      );
    }
    return items;
  }, [query.data, search, customerFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(0);
  }

  function handleCustomerFilter(value: number | "") {
    setCustomerFilter(value);
    setPage(0);
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setFormError("");
    setPendingDeleteId(null);
    setShowForm(true);
  }

  function openEdit(site: BackendSite) {
    setEditing(site);
    setForm({
      customerId: site.customer?.id ?? "",
      name: site.name,
      addressLine1: site.addressLine1 ?? "",
      addressLine2: site.addressLine2 ?? "",
      city: site.city ?? "",
      state: site.state ?? "",
      postalCode: site.postalCode ?? "",
      country: site.country ?? "India",
      active: site.active ?? true,
    });
    setFormError("");
    setPendingDeleteId(null);
    setShowForm(true);
  }

  const saveMutation = useMutation({
    mutationFn: () => {
      if (editing) return updateSite(editing.id, toUpdateSitePayload(form), token!);
      if (!form.customerId) throw new ApiError(400, "Customer is required.");
      return createSite(toCreateSitePayload({ ...form, customerId: form.customerId }), token!);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["sites"] });
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm());
      setFormError("");
    },
    onError: (caught) => setFormError(errorMessage(caught, "Unable to save site.")),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSite(id, token!),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["sites"] });
      setPendingDeleteId(null);
      setListError("");
    },
    onError: (caught) => {
      if (caught instanceof ApiError && caught.status === 409) {
        setListError(DELETE_BLOCKED);
        return;
      }
      setListError(errorMessage(caught, "Unable to delete site."));
    },
  });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    if (!editing && !form.customerId) { setFormError("Customer is required."); return; }
    if (!form.name.trim() || !form.addressLine1.trim() || !form.city.trim() || !form.country.trim()) {
      setFormError("Name, address line 1, city, and country are required.");
      return;
    }
    saveMutation.mutate();
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">OPERATIONS</p>
          <h1>Sites</h1>
          <p>Sites from the API, grouped under their customer.</p>
        </div>
        <button className="primary-button" type="button" onClick={openCreate}>
          <Plus size={18} />Add Site
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={submit}>
          {editing ? (
            <label>
              Customer
              <input value={editing.customer?.name ?? "—"} disabled />
            </label>
          ) : (
            <label>
              Customer
              <select
                value={form.customerId}
                onChange={(e) => setForm((current) => ({ ...current, customerId: e.target.value ? Number(e.target.value) : "" }))}
                required
              >
                <option value="" disabled>Select customer</option>
                {customersQuery.data?.map((customer) => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </label>
          )}
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
              placeholder="Enter site name"
              required
            />
          </label>
          <label>
            Address line 1
            <input
              value={form.addressLine1}
              onChange={(e) => setForm((current) => ({ ...current, addressLine1: e.target.value }))}
              placeholder="Address line 1"
              required
            />
          </label>
          <label>
            Address line 2
            <input
              value={form.addressLine2}
              onChange={(e) => setForm((current) => ({ ...current, addressLine2: e.target.value }))}
              placeholder="Address line 2"
            />
          </label>
          <div className="form-grid">
            <label>
              City
              <input
                value={form.city}
                onChange={(e) => setForm((current) => ({ ...current, city: e.target.value }))}
                placeholder="City"
                required
              />
            </label>
            <label>
              State
              <input
                value={form.state}
                onChange={(e) => setForm((current) => ({ ...current, state: e.target.value }))}
                placeholder="State"
              />
            </label>
            <label>
              Postal code
              <input
                value={form.postalCode}
                onChange={(e) => setForm((current) => ({ ...current, postalCode: e.target.value }))}
                placeholder="Postal code"
                disabled={Boolean(editing)}
              />
            </label>
          </div>
          <div className="form-grid">
            <label>
              Country
              <input
                value={form.country}
                onChange={(e) => setForm((current) => ({ ...current, country: e.target.value }))}
                placeholder="Country"
                required
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
              <Save size={17} />{saveMutation.isPending ? "Saving..." : editing ? "Save Site" : "Create Site"}
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
            placeholder="Search by site, city, or customer..."
            aria-label="Search sites"
          />
        </div>
        <label>
          <select
            value={customerFilter}
            onChange={(e) => handleCustomerFilter(e.target.value ? Number(e.target.value) : "")}
            aria-label="Filter by customer"
          >
            <option value="">All customers</option>
            {customersQuery.data?.map((customer) => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
        </label>
      </section>

      {listError && <p className="form-error" role="alert">{listError}</p>}

      <section className="table-card">
        {query.isLoading ? <LoadingState label="Loading sites..." /> :
          query.isError ? <ErrorState message="Unable to load sites. Please try again." /> :
          !pageItems.length ? <EmptyState message={search || customerFilter ? "No sites match your filters." : "No sites available."} /> : (
            <>
              <div className="data-table">
                <div className="table-row table-header">
                  <span>Site</span>
                  <span>Customer</span>
                  <span>City</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
                {pageItems.map((site) => (
                  <div className="table-row" key={site.id}>
                    <span>
                      <strong>{site.name}</strong>
                      <small>{site.addressLine1 || "No address"}</small>
                    </span>
                    <span>{site.customer?.name ?? "—"}</span>
                    <span>{site.city || "—"}</span>
                    <span><span className="priority">{site.active === false ? "INACTIVE" : "ACTIVE"}</span></span>
                    <span>
                      {pendingDeleteId === site.id ? (
                        <>
                          <button
                            className="text-button"
                            type="button"
                            onClick={() => deleteMutation.mutate(site.id)}
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? "Deleting..." : "Confirm"}
                          </button>
                          <button className="text-button" type="button" onClick={() => setPendingDeleteId(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="text-button" type="button" onClick={() => openEdit(site)}>Edit</button>
                          <button className="text-button" type="button" onClick={() => setPendingDeleteId(site.id)}>Delete</button>
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
