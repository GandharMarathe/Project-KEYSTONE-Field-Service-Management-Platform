import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus, Save, Search } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "../components/common/Feedback";
import { useAuth } from "../features/auth/AuthContext";
import { ApiError } from "../services/apiClient";
import { createUser, getUsers } from "../services/userApi";
import type { Role } from "../types/auth";

const PAGE_SIZE = 20;
const ROLES: Role[] = ["MANAGER", "DISPATCHER", "TECHNICIAN", "CUSTOMER"];

function emptyForm() {
  return { email: "", password: "", firstName: "", lastName: "", role: "TECHNICIAN" as Role };
}

function errorMessage(caught: unknown, fallback: string) {
  if (!(caught instanceof ApiError)) return fallback;
  if (caught.fieldErrors && Object.keys(caught.fieldErrors).length) {
    return Object.values(caught.fieldErrors).join(" ");
  }
  return caught.message || fallback;
}

export function UsersPage() {
  const { token } = useAuth();
  const client = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const query = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(token!),
    enabled: Boolean(token),
  });

  const filtered = useMemo(() => {
    const items = query.data ?? [];
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((user) =>
      user.email.toLowerCase().includes(q)
      || user.firstName.toLowerCase().includes(q)
      || user.lastName.toLowerCase().includes(q)
      || user.role.toLowerCase().includes(q)
    );
  }, [query.data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const mutation = useMutation({
    mutationFn: () => createUser({
      email: form.email.trim(),
      password: form.password,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      role: form.role,
    }, token!),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["users"] });
      setShowForm(false);
      setForm(emptyForm());
      setFormError("");
    },
    onError: (caught) => {
      if (caught instanceof ApiError && caught.status === 409) {
        setFormError("A user with this email already exists.");
        return;
      }
      setFormError(errorMessage(caught, "Unable to create user."));
    },
  });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    if (!form.email.trim() || !form.firstName.trim() || !form.lastName.trim()) {
      setFormError("Email, first name, and last name are required.");
      return;
    }
    if (form.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    mutation.mutate();
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">OPERATIONS</p>
          <h1>Users</h1>
          <p>User accounts from the API. Managers only.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => { setShowForm(true); setFormError(""); }}>
          <Plus size={18} />Add User
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={submit}>
          <div className="form-grid">
            <label>
              Email
              <input type="email" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} placeholder="Email" required autoComplete="off" />
            </label>
            <label>
              Password
              <input type="password" value={form.password} onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))} placeholder="At least 8 characters" required autoComplete="new-password" />
            </label>
            <label>
              Role
              <select value={form.role} onChange={(e) => setForm((current) => ({ ...current, role: e.target.value as Role }))}>
                {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
            </label>
          </div>
          <div className="form-grid">
            <label>
              First name
              <input value={form.firstName} onChange={(e) => setForm((current) => ({ ...current, firstName: e.target.value }))} placeholder="First name" required />
            </label>
            <label>
              Last name
              <input value={form.lastName} onChange={(e) => setForm((current) => ({ ...current, lastName: e.target.value }))} placeholder="Last name" required />
            </label>
          </div>
          {formError && <p className="form-error" role="alert">{formError}</p>}
          <div className="form-actions">
            <button className="text-button" type="button" onClick={() => { setShowForm(false); setFormError(""); }}>Cancel</button>
            <button className="primary-button" type="submit" disabled={mutation.isPending}>
              <Save size={17} />{mutation.isPending ? "Saving..." : "Create User"}
            </button>
          </div>
        </form>
      )}

      <section className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search by name, email, or role..." aria-label="Search users" />
        </div>
      </section>

      <section className="table-card">
        {query.isLoading ? <LoadingState label="Loading users..." /> :
          query.isError ? <ErrorState message="Unable to load users. Please try again." /> :
          !pageItems.length ? <EmptyState message={search ? "No users match your filters." : "No users available."} /> : (
            <>
              <div className="data-table">
                <div className="table-row table-header">
                  <span>User</span>
                  <span>Email</span>
                  <span>Role</span>
                  <span>Status</span>
                  <span>ID</span>
                </div>
                {pageItems.map((user) => (
                  <div className="table-row" key={user.id}>
                    <span>
                      <strong>{`${user.firstName} ${user.lastName}`.trim()}</strong>
                    </span>
                    <span>{user.email}</span>
                    <span>{user.role}</span>
                    <span><span className="priority">{user.enabled ? "ENABLED" : "DISABLED"}</span></span>
                    <span>{user.id}</span>
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
