import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/common/Feedback";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAuth } from "../features/auth/AuthContext";
import { getWorkOrders } from "../services/workOrderApi";
import type { WorkOrderStatus } from "../types/workOrder";

const columns: { status: WorkOrderStatus; title: string }[] = [{ status: "NEW", title: "New" }, { status: "ASSIGNED", title: "Assigned" }, { status: "IN_PROGRESS", title: "In Progress" }, { status: "ON_HOLD", title: "On Hold" }, { status: "COMPLETED", title: "Completed" }];
export function DispatchPage() {
  const { token } = useAuth(); const query = useQuery({ queryKey: ["dispatch-board"], queryFn: () => getWorkOrders({ page: 0, size: 100 }, token!), enabled: Boolean(token) });
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">DISPATCH</p><h1>Work Order Board</h1><p>Live status groups are sourced from the work-order API.</p></div><span className="board-note"><AlertCircle size={16} />Status transitions are validated by the server.</span></div>{query.isLoading ? <LoadingState label="Loading dispatch board..." /> : query.isError ? <ErrorState message="Unable to load dispatch board. Please try again." /> : <section className="kanban">{columns.map(({ status, title }) => { const workOrders = query.data?.content.filter((item) => item.status === status) ?? []; return <div className="kanban-column" key={status}><div className="kanban-title"><h2>{title}</h2><span>{workOrders.length}</span></div>{workOrders.length ? workOrders.map((workOrder) => <Link className="work-card" key={workOrder.id} to={`/work-orders/${workOrder.id}`}><div><small>{workOrder.code}</small><StatusBadge status={workOrder.status} /></div><strong>{workOrder.title}</strong><p>{workOrder.customerId || "Customer Name"}</p><footer><span className="priority">{workOrder.priority}</span><span>{workOrder.slaDueDate || "SLA due date"}</span></footer></Link>) : <div className="kanban-empty">No work orders</div>}</div>; })}</section>}</div>;
}
