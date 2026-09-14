import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Filter, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/common/Feedback";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAuth } from "../features/auth/AuthContext";
import { getWorkOrders } from "../services/workOrderApi";

const PAGE_SIZE = 20;

export function WorkOrdersPage() {
  const { token } = useAuth();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const query = useQuery({
    queryKey: ["work-orders"],
    queryFn: () => getWorkOrders({}, token!),
    enabled: Boolean(token),
  });

  const filtered = useMemo(() => {
    let items = query.data ?? [];
    if (search) items = items.filter((w) => w.title.toLowerCase().includes(search.toLowerCase()) || w.code.toLowerCase().includes(search.toLowerCase()));
    if (status) items = items.filter((w) => w.status === status);
    if (priority) items = items.filter((w) => w.priority === priority);
    return items;
  }, [query.data, search, status, priority]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function handleSearch(value: string) { setSearch(value); setPage(0); }
  function handleStatus(value: string) { setStatus(value); setPage(0); }
  function handlePriority(value: string) { setPriority(value); setPage(0); }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">OPERATIONS</p>
          <h1>Work Orders</h1>
          <p>All work orders from the API.</p>
        </div>
        <Link className="primary-button" to="/work-orders/new"><Plus size={18} />Create Work Order</Link>
      </div>

      <section className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Search by title or code..." aria-label="Search work orders" />
        </div>
        <label>
          <Filter size={16} />
          <select value={status} onChange={(e) => handleStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="NEW">New</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
            <option value="CLOSED">Closed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </label>
        <label>
          <select value={priority} onChange={(e) => handlePriority(e.target.value)}>
            <option value="">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </label>
      </section>

      <section className="table-card">
        {query.isLoading ? <LoadingState label="Loading work orders..." /> :
          query.isError ? <ErrorState message="Unable to load work orders. Please try again." /> :
          !pageItems.length ? <EmptyState message="No work orders match your filters." /> : (
            <>
              <div className="data-table">
                <div className="table-row table-header">
                  <span>Work order</span>
                  <span>Status</span>
                  <span>Priority</span>
                  <span>Customer</span>
                  <span>Site</span>
                </div>
                {pageItems.map((wo) => (
                  <Link to={`/work-orders/${wo.id}`} className="table-row" key={wo.id}>
                    <span><strong>{wo.code}</strong><small>{wo.title}</small></span>
                    <span><StatusBadge status={wo.status} /></span>
                    <span><span className="priority">{wo.priority}</span></span>
                    <span>{wo.customer?.name ?? "—"}</span>
                    <span>{wo.site?.name ?? "—"}</span>
                  </Link>
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
