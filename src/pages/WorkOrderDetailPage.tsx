import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CalendarClock, CircleAlert, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/common/Feedback";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAuth } from "../features/auth/AuthContext";
import { ApiError } from "../services/apiClient";
import { changeWorkOrderStatus, getWorkOrder } from "../services/workOrderApi";
import type { WorkOrderStatus } from "../types/workOrder";

const actions: Partial<Record<WorkOrderStatus, { label: string; target: WorkOrderStatus }>> = { ASSIGNED: { label: "Start Job", target: "IN_PROGRESS" }, IN_PROGRESS: { label: "Put On Hold", target: "ON_HOLD" }, ON_HOLD: { label: "Resume", target: "IN_PROGRESS" }, COMPLETED: { label: "Close Work Order", target: "CLOSED" } };
export function WorkOrderDetailPage() {
  const { id = "" } = useParams(); const { token, role } = useAuth(); const client = useQueryClient(); const [actionError, setActionError] = useState("");
  const query = useQuery({ queryKey: ["work-order", id], queryFn: () => getWorkOrder(id, token!), enabled: Boolean(token && id) });
  const mutation = useMutation({ mutationFn: (status: WorkOrderStatus) => changeWorkOrderStatus(id, status, token!), onSuccess: () => { client.invalidateQueries({ queryKey: ["work-order", id] }); client.invalidateQueries({ queryKey: ["work-orders"] }); setActionError(""); }, onError: (caught) => setActionError(caught instanceof ApiError ? caught.message : "Unable to update work-order status.") });
  if (query.isLoading) return <div className="page"><LoadingState label="Loading work order..." /></div>;
  if (query.isError || !query.data) return <div className="page"><ErrorState message="The requested resource could not be found." /></div>;
  const workOrder = query.data; const action = actions[workOrder.status]; const canPerform = role === "TECHNICIAN" || role === "MANAGER";
  return <div className="page"><Link className="back-link" to={role === "TECHNICIAN" ? "/my-jobs" : "/work-orders"}><ArrowLeft size={17} />Back to work orders</Link><div className="detail-header"><div><p className="eyebrow">{workOrder.code}</p><h1>{workOrder.title}</h1><div className="badge-row"><StatusBadge status={workOrder.status} /><span className="priority">{workOrder.priority}</span></div></div>{action && canPerform && <button className="primary-button" onClick={() => mutation.mutate(action.target)} disabled={mutation.isPending}>{mutation.isPending ? "Updating..." : action.label}</button>}</div>{actionError && <div className="inline-error" role="alert"><CircleAlert size={17} />{actionError}</div>}<section className="details-grid"><article className="panel"><p className="eyebrow">JOB INFORMATION</p><h2>Work order details</h2><dl><div><dt>Description</dt><dd>{workOrder.description || "No description available."}</dd></div><div><dt>Customer</dt><dd>{workOrder.customerId || "Customer Name"}</dd></div><div><dt>Site</dt><dd>{workOrder.siteId || "Site Address"}</dd></div><div><dt>Assigned technician</dt><dd>{workOrder.assigneeId || "Select technician"}</dd></div></dl></article><article className="panel"><p className="eyebrow">SLA STATUS</p><h2>Service commitment</h2><div className="info-callout"><CalendarClock size={19} /><div><strong>SLA due date</strong><span>{workOrder.slaDueDate || "SLA due date"}</span></div></div><p className="muted">SLA status will display when provided by the backend.</p></article><article className="panel"><p className="eyebrow">STATUS HISTORY</p><h2>Timeline</h2><EmptyState message="No status history available." /></article><article className="panel"><p className="eyebrow">PARTS & TIME</p><h2>Job activity</h2><EmptyState message="No parts or time logs available." /></article></section></div>;
}
