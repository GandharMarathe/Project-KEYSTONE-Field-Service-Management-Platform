import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus, Save, Search } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "../components/common/Feedback";
import { useAuth } from "../features/auth/AuthContext";
import { ApiError } from "../services/apiClient";
import { createPart, deletePart, getParts, toPartPayload, updatePart } from "../services/partApi";
import type { BackendPart } from "../types/workOrder";

const PAGE_SIZE = 20;
const DUPLICATE_NUMBER = "A part with this number already exists.";
const DELETE_BLOCKED = "This part cannot be deleted because it has been used on a work order.";

function emptyForm() {
  return { partNumber: "", name: "", description: "", unitCost: "0", stockQuantity: "0", active: true };
}

function errorMessage(caught: unknown, fallback: string) {
  if (!(caught instanceof ApiError)) return fallback;
  if (caught.fieldErrors && Object.keys(caught.fieldErrors).length) {
    return Object.values(caught.fieldErrors).join(" ");
  }
  return caught.message || fallback;
}

function parseCost(value: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}

function parseStock(value: string) {
  if (!/^\d+$/.test(value.trim())) return null;
  return Number(value);
}

export function PartsPage() {
  const { token } = useAuth();
  const client = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BackendPart | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [listError, setListError] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const query = useQuery({
    queryKey: ["parts"],
    queryFn: () => getParts(token!),
    enabled: Boolean(token),
  });

  const filtered = useMemo(() => {
    let items = query.data ?? [];
    if (activeOnly) items = items.filter((part) => part.active !== false);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((part) =>
        part.partNumber.toLowerCase().includes(q)
        || part.name.toLowerCase().includes(q)
      );
    }
    return items;
  }, [query.data, search, activeOnly]);

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

  function openEdit(part: BackendPart) {
    setEditing(part);
    setForm({
      partNumber: part.partNumber,
      name: part.name,
      description: part.description ?? "",
      unitCost: String(part.unitCost ?? 0),
      stockQuantity: String(part.stockQuantity ?? 0),
      active: part.active ?? true,
    });
    setFormError("");
    setPendingDeleteId(null);
    setShowForm(true);
  }

  const saveMutation = useMutation({
    mutationFn: () => {
      const unitCost = parseCost(form.unitCost);
      const stockQuantity = parseStock(form.stockQuantity);
      if (unitCost == null || stockQuantity == null) {
        throw new ApiError(400, "Unit cost must be a number ≥ 0 and stock must be a whole number ≥ 0.");
      }
      const payload = toPartPayload({ ...form, unitCost, stockQuantity });
      return editing
        ? updatePart(editing.id, payload, token!)
        : createPart(payload, token!);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["parts"] });
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm());
      setFormError("");
    },
    onError: (caught) => {
      if (caught instanceof ApiError && caught.status === 409) {
        setFormError(DUPLICATE_NUMBER);
        return;
      }
      setFormError(errorMessage(caught, "Unable to save part."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePart(id, token!),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["parts"] });
      setPendingDeleteId(null);
      setListError("");
    },
    onError: (caught) => {
      if (caught instanceof ApiError && caught.status === 409) {
        setListError(DELETE_BLOCKED);
        return;
      }
      setListError(errorMessage(caught, "Unable to delete part."));
    },
  });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    if (!form.partNumber.trim() || !form.name.trim()) {
      setFormError("Part number and name are required.");
      return;
    }
    if (parseCost(form.unitCost) == null || parseStock(form.stockQuantity) == null) {
      setFormError("Unit cost must be a number ≥ 0 and stock must be a whole number ≥ 0.");
      return;
    }
    saveMutation.mutate();
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">OPERATIONS</p>
          <h1>Parts</h1>
          <p>Parts catalog from the API.</p>
        </div>
        <button className="primary-button" type="button" onClick={openCreate}>
          <Plus size={18} />Add Part
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={submit}>
          <div className="form-grid">
            <label>
              Part number
              <input
                value={form.partNumber}
                onChange={(e) => setForm((current) => ({ ...current, partNumber: e.target.value }))}
                placeholder="Part number"
                required
              />
            </label>
            <label>
              Name
              <input
                value={form.name}
                onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                placeholder="Part name"
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
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
              placeholder="Description"
              rows={3}
            />
          </label>
          <div className="form-grid">
            <label>
              Unit cost
              <input
                inputMode="decimal"
                value={form.unitCost}
                onChange={(e) => setForm((current) => ({ ...current, unitCost: e.target.value }))}
                placeholder="0.00"
                required
              />
            </label>
            <label>
              Stock quantity
              <input
                inputMode="numeric"
                value={form.stockQuantity}
                onChange={(e) => setForm((current) => ({ ...current, stockQuantity: e.target.value }))}
                placeholder="0"
                required
              />
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
              <Save size={17} />{saveMutation.isPending ? "Saving..." : editing ? "Save Part" : "Create Part"}
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
            placeholder="Search by part number or name..."
            aria-label="Search parts"
          />
        </div>
        <label>
          <select
            value={activeOnly ? "active" : "all"}
            onChange={(e) => { setActiveOnly(e.target.value === "active"); setPage(0); }}
            aria-label="Filter by active parts"
          >
            <option value="all">All parts</option>
            <option value="active">Active only</option>
          </select>
        </label>
      </section>

      {listError && <p className="form-error" role="alert">{listError}</p>}

      <section className="table-card">
        {query.isLoading ? <LoadingState label="Loading parts..." /> :
          query.isError ? <ErrorState message="Unable to load parts. Please try again." /> :
          !pageItems.length ? <EmptyState message={search || activeOnly ? "No parts match your filters." : "No parts available."} /> : (
            <>
              <div className="data-table">
                <div className="table-row table-header">
                  <span>Part</span>
                  <span>Unit cost</span>
                  <span>Stock</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
                {pageItems.map((part) => (
                  <div className="table-row" key={part.id}>
                    <span>
                      <strong>{part.partNumber}</strong>
                      <small>{part.name}</small>
                    </span>
                    <span>{part.unitCost}</span>
                    <span>{part.stockQuantity}</span>
                    <span><span className="priority">{part.active === false ? "INACTIVE" : "ACTIVE"}</span></span>
                    <span>
                      {pendingDeleteId === part.id ? (
                        <>
                          <button
                            className="text-button"
                            type="button"
                            onClick={() => deleteMutation.mutate(part.id)}
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? "Deleting..." : "Confirm"}
                          </button>
                          <button className="text-button" type="button" onClick={() => setPendingDeleteId(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="text-button" type="button" onClick={() => openEdit(part)}>Edit</button>
                          <button className="text-button" type="button" onClick={() => setPendingDeleteId(part.id)}>Delete</button>
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
