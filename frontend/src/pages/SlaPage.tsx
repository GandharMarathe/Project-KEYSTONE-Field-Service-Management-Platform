import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/common/Feedback";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAuth } from "../features/auth/AuthContext";
import { getWorkOrders } from "../services/workOrderApi";
import type { WorkOrder, WorkOrderStatus } from "../types/workOrder";

const TERMINAL: WorkOrderStatus[] = ["COMPLETED", "CLOSED", "CANCELLED"];

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function slaGroup(workOrder: WorkOrder) {
  if (!workOrder.slaDueAt) return "none";
  const due = new Date(workOrder.slaDueAt).getTime();
  if (Number.isNaN(due)) return "none";
  const terminal = TERMINAL.includes(workOrder.status);
  if (due < Date.now() && !terminal) return "breached";
  if (due >= Date.now()) return "within";
  return "pastClosed";
}

function OrderTable({ items }: { items: WorkOrder[] }) {
  if (!items.length) return <EmptyState message="No work orders in this group." />;
  return (
    <div className="data-table">
      <div className="table-row table-header">
        <span>Work order</span>
        <span>Status</span>
        <span>SLA due</span>
        <span>Customer</span>
        <span>Site</span>
      </div>
      {items.map((wo) => (
        <Link to={`/work-orders/${wo.id}`} className="table-row" key={wo.id}>
          <span><strong>{wo.code}</strong><small>{wo.title}</small></span>
          <span><StatusBadge status={wo.status} /></span>
          <span>{formatDate(wo.slaDueAt)}</span>
          <span>{wo.customer?.name ?? "—"}</span>
          <span>{wo.site?.name ?? "—"}</span>
        </Link>
      ))}
    </div>
  );
}

export function SlaPage() {
  const { token } = useAuth();
  const query = useQuery({
    queryKey: ["work-orders"],
    queryFn: () => getWorkOrders({}, token!),
    enabled: Boolean(token),
  });

  const groups = useMemo(() => {
    const items = query.data ?? [];
    return {
      breached: items.filter((wo) => slaGroup(wo) === "breached"),
      within: items.filter((wo) => slaGroup(wo) === "within"),
      none: items.filter((wo) => slaGroup(wo) === "none"),
      pastClosed: items.filter((wo) => slaGroup(wo) === "pastClosed"),
    };
  }, [query.data]);

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">MANAGEMENT</p>
          <h1>SLA Monitoring</h1>
          <p>Grouped from each work order’s slaDueAt field. This is not a compliance percentage.</p>
        </div>
      </div>

      {query.isLoading ? <LoadingState label="Loading work orders..." /> :
        query.isError ? <ErrorState message="Unable to load work orders for SLA grouping." /> : (
          <div className="history-list">
            <section className="table-card">
              <p className="eyebrow">BREACHED</p>
              <h2>Past SLA and still open ({groups.breached.length})</h2>
              <OrderTable items={groups.breached} />
            </section>
            <section className="table-card">
              <p className="eyebrow">WITHIN SLA</p>
              <h2>SLA due in the future ({groups.within.length})</h2>
              <OrderTable items={groups.within} />
            </section>
            <section className="table-card">
              <p className="eyebrow">NO SLA DATE SET</p>
              <h2>No slaDueAt ({groups.none.length})</h2>
              <OrderTable items={groups.none} />
            </section>
            <section className="table-card">
              <p className="eyebrow">SLA DATE PASSED</p>
              <h2>Completed, closed, or cancelled after the due date ({groups.pastClosed.length})</h2>
              <OrderTable items={groups.pastClosed} />
            </section>
          </div>
        )}
    </div>
  );
}
