import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CalendarClock, CircleAlert, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/common/Feedback";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAuth } from "../features/auth/AuthContext";
import { ApiError } from "../services/apiClient";
import { changeWorkOrderStatus, getWorkOrder, getStatusHistory } from "../services/workOrderApi";
import type { WorkOrderStatus } from "../types/workOrder";

const TECH_ACTIONS: Partial<Record<WorkOrderStatus, { label: string; target: WorkOrderStatus }>> = {
  ASSIGNED: { label: "Start Job", target: "IN_PROGRESS" },
  IN_PROGRESS: { label: "Put On Hold", target: "ON_HOLD" },
  ON_HOLD: { label: "Resume", target: "IN_PROGRESS" },
};
const MANAGER_ACTIONS: Partial<Record<WorkOrderStatus, { label: string; target: WorkOrderStatus }>> = {
  ...TECH_ACTIONS,
  COMPLETED: { label: "Close Work Order", target: "CLOSED" },
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export function WorkOrderDetailPage() {
  const { id = "" } = useParams();
  const { token, role, user } = useAuth();
  const client = useQueryClient();
  const [actionError, setActionError] = useState("");

  const query = useQuery({
    queryKey: ["work-order", id],
    queryFn: () => getWorkOrder(id, token!),
    enabled: Boolean(token && id),
  });

  const historyQuery = useQuery({
    queryKey: ["work-order-history", id],
    queryFn: () => getStatusHistory(id, token!),
    enabled: Boolean(token && id),
  });

  const mutation = useMutation({
    mutationFn: (status: WorkOrderStatus) => changeWorkOrderStatus(id, status, token!),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["work-order", id] });
      client.invalidateQueries({ queryKey: ["work-order-history", id] });
      client.invalidateQueries({ queryKey: ["work-orders"] });
      setActionError("");
    },
    onError: (caught) => setActionError(caught instanceof ApiError ? caught.message : "Unable to update status."),
  });

  if (query.isLoading) return <div className="page"><LoadingState label="Loading work order..." /></div>;
  if (query.isError || !query.data) return <div className="page"><ErrorState message="Work order not found." /></div>;

  const wo = query.data;
  const actionMap = role === "TECHNICIAN" ? TECH_ACTIONS : MANAGER_ACTIONS;
  const action = actionMap[wo.status];
  const canAct = role === "TECHNICIAN"
    ? wo.assignedTo?.id === Number(user?.id)
    : role === "MANAGER" || role === "DISPATCHER";

  const assigneeName = wo.assignedTo
    ? `${wo.assignedTo.firstName ?? ""} ${wo.assignedTo.lastName ?? ""}`.trim() || wo.assignedTo.email
    : "Unassigned";

  return (
    <div className="page">
      <Link className="back-link" to={role === "TECHNICIAN" ? "/my-jobs" : "/work-orders"}>
        <ArrowLeft size={17} />Back to work orders
      </Link>

      <div className="detail-header">
        <div>
          <p className="eyebrow">{wo.code}</p>
          <h1>{wo.title}</h1>
          <div className="badge-row">
            <StatusBadge status={wo.status} />
            <span className="priority">{wo.priority}</span>
          </div>
        </div>
        {action && canAct && (
          <button className="primary-button" onClick={() => mutation.mutate(action.target)} disabled={mutation.isPending}>
            {mutation.isPending ? "Updating..." : action.label}
          </button>
        )}
      </div>

      {actionError && <div className="inline-error" role="alert"><CircleAlert size={17} />{actionError}</div>}

      <section className="details-grid">
        <article className="panel">
          <p className="eyebrow">JOB INFORMATION</p>
          <h2>Work order details</h2>
          <dl>
            <div><dt>Description</dt><dd>{wo.description || "No description provided."}</dd></div>
            <div><dt>Customer</dt><dd>{wo.customer?.name ?? "—"}</dd></div>
            <div><dt>Site</dt><dd>{wo.site?.name ?? "—"}{wo.site?.city ? `, ${wo.site.city}` : ""}</dd></div>
            <div><dt>Assigned technician</dt><dd><span style={{ display: "inline-flex", alignItems: "center", gap: ".35rem" }}><UserRound size={14} />{assigneeName}</span></dd></div>
            <div><dt>Created</dt><dd>{formatDate(wo.createdAt)}</dd></div>
            <div><dt>Last updated</dt><dd>{formatDate(wo.updatedAt)}</dd></div>
          </dl>
        </article>

        <article className="panel">
          <p className="eyebrow">SLA STATUS</p>
          <h2>Service commitment</h2>
          {wo.slaDueAt ? (
            <div className="info-callout">
              <CalendarClock size={19} />
              <div><strong>SLA due date</strong><span>{formatDate(wo.slaDueAt)}</span></div>
            </div>
          ) : (
            <EmptyState message="No SLA date set." />
          )}
        </article>

        <article className="panel">
          <p className="eyebrow">STATUS HISTORY</p>
          <h2>Timeline</h2>
          {historyQuery.isLoading ? <LoadingState label="Loading history..." /> :
            historyQuery.isError ? <ErrorState message="Unable to load history." /> :
            !historyQuery.data?.length ? <EmptyState message="No status changes recorded yet." /> : (
              <ol className="history-list">
                {historyQuery.data.map((item) => (
                  <li key={item.id} className="history-item">
                    <div className="history-meta">
                      <span className="history-time">{formatDate(item.changedAt)}</span>
                      {item.changedBy && <span className="history-by">{item.changedBy.firstName ?? item.changedBy.email}</span>}
                    </div>
                    <div className="history-transition">
                      {item.fromStatus && <StatusBadge status={item.fromStatus} />}
                      {item.fromStatus && <span className="history-arrow">→</span>}
                      <StatusBadge status={item.toStatus} />
                    </div>
                    {item.note && <p className="history-note">{item.note}</p>}
                  </li>
                ))}
              </ol>
            )}
        </article>

        <article className="panel">
          <p className="eyebrow">PARTS & TIME</p>
          <h2>Job activity</h2>
          <EmptyState message="No parts or time logs recorded." />
        </article>
      </section>
    </div>
  );
}
