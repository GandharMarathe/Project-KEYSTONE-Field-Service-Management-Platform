import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CalendarClock, CircleAlert, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/common/Feedback";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAuth } from "../features/auth/AuthContext";
import { ApiError } from "../services/apiClient";
import { assignWorkOrder, changeWorkOrderStatus, getWorkOrder, getStatusHistory } from "../services/workOrderApi";
import { getUsers } from "../services/userApi";
import { getParts } from "../services/partApi";
import { createPartUsage, getPartUsages } from "../services/partUsageApi";
import { createTimeLog, getTimeLogs } from "../services/timeLogApi";
import type { BackendUser, WorkOrder, WorkOrderStatus } from "../types/workOrder";

type StatusAction = { label: string; target: WorkOrderStatus; kind: "primary" | "outline" };

const TECH_ACTIONS: Partial<Record<WorkOrderStatus, StatusAction[]>> = {
  ASSIGNED: [{ label: "Start Job", target: "IN_PROGRESS", kind: "primary" }],
  IN_PROGRESS: [
    { label: "Put On Hold", target: "ON_HOLD", kind: "outline" },
    { label: "Complete Job", target: "COMPLETED", kind: "primary" },
  ],
  ON_HOLD: [{ label: "Resume", target: "IN_PROGRESS", kind: "primary" }],
};
const MANAGER_ACTIONS: Partial<Record<WorkOrderStatus, StatusAction[]>> = {
  ...TECH_ACTIONS,
  COMPLETED: [{ label: "Close Work Order", target: "CLOSED", kind: "primary" }],
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
    mutationFn: ({ status, note }: { status: WorkOrderStatus; note: string }) => {
      if (!query.data) throw new Error("Work order is not loaded.");
      return changeWorkOrderStatus(query.data, status, token!, role, note);
    },
    onSuccess: () => setActionError(""),
    onError: (caught) => setActionError(caught instanceof ApiError ? caught.message : "Unable to update status."),
    // Always refetch: PUT may have succeeded even when the follow-up history POST failed.
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["work-order", id] });
      client.invalidateQueries({ queryKey: ["work-order-history", id] });
      client.invalidateQueries({ queryKey: ["work-orders"] });
      client.invalidateQueries({ queryKey: ["my-jobs"] });
      // Reports summary is status counts; keep it fresh after every transition.
      client.invalidateQueries({ queryKey: ["summary"] });
    },
  });

  if (query.isLoading) return <div className="page"><LoadingState label="Loading work order..." /></div>;
  if (query.isError || !query.data) return <div className="page"><ErrorState message="Work order not found." /></div>;

  const wo = query.data;
  const actionMap = role === "TECHNICIAN" ? TECH_ACTIONS : MANAGER_ACTIONS;
  const actions = actionMap[wo.status] ?? [];
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
        {canAct && actions.length > 0 && (
          <div className="badge-row">
            {actions.map((action) => (
              <button
                key={action.target}
                className={action.kind === "outline" ? "outline-button" : "primary-button"}
                onClick={() => mutation.mutate({ status: action.target, note: action.label })}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Updating..." : action.label}
              </button>
            ))}
          </div>
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
            {role === "MANAGER" && (wo.status === "NEW" || wo.status === "ASSIGNED") && (
              <div>
                <dt>Assign</dt>
                <dd>
                  <AssignTechnicianForm workOrder={wo} token={token!} />
                </dd>
              </div>
            )}
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
          <JobActivityPanel workOrderId={wo.id} token={token!} canLog={canAct} />
        </article>
      </section>
    </div>
  );
}

function personName(person?: BackendUser) {
  if (!person) return "—";
  return `${person.firstName ?? ""} ${person.lastName ?? ""}`.trim() || person.email;
}

function AssignTechnicianForm({ workOrder, token }: { workOrder: WorkOrder; token: string }) {
  const client = useQueryClient();
  const [technicianId, setTechnicianId] = useState<number | "">(workOrder.assignedTo?.id ?? "");
  const [error, setError] = useState("");

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(token),
    // GET /api/users is MANAGER-only. This form is not rendered for other roles.
    enabled: Boolean(token),
  });

  const technicians = (usersQuery.data ?? []).filter((user) => user.role === "TECHNICIAN" && user.enabled);

  const mutation = useMutation({
    mutationFn: () => {
      if (!technicianId) throw new ApiError(400, "Select a technician.");
      return assignWorkOrder(workOrder, technicianId, token);
    },
    onSuccess: () => {
      setError("");
      client.invalidateQueries({ queryKey: ["work-order", String(workOrder.id)] });
      client.invalidateQueries({ queryKey: ["work-order-history", String(workOrder.id)] });
      client.invalidateQueries({ queryKey: ["work-orders"] });
      client.invalidateQueries({ queryKey: ["my-jobs"] });
      client.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (caught) => setError(caught instanceof ApiError ? caught.message : "Unable to assign technician."),
  });

  return (
    <form
      onSubmit={(event) => { event.preventDefault(); setError(""); mutation.mutate(); }}
      style={{ display: "grid", gap: ".45rem", maxWidth: 320 }}
    >
      <select
        value={technicianId}
        onChange={(e) => setTechnicianId(e.target.value ? Number(e.target.value) : "")}
        required
        aria-label="Select technician"
      >
        <option value="" disabled>Select technician</option>
        {technicians.map((user) => (
          <option key={user.id} value={user.id}>
            {`${user.firstName} ${user.lastName}`.trim() || user.email}
          </option>
        ))}
      </select>
      {usersQuery.isError && <p className="form-error">Unable to load technicians.</p>}
      {!usersQuery.isLoading && !usersQuery.isError && technicians.length === 0 && (
        <p className="history-note">No enabled technicians. Create one under Users.</p>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-button" type="submit" disabled={mutation.isPending || !technicianId}>
        {mutation.isPending ? "Assigning..." : workOrder.status === "NEW" ? "Assign technician" : "Reassign"}
      </button>
    </form>
  );
}

function JobActivityPanel({
  workOrderId,
  token,
  canLog,
}: {
  workOrderId: number;
  token: string;
  canLog: boolean;
}) {
  const client = useQueryClient();
  const [partId, setPartId] = useState<number | "">("");
  const [quantity, setQuantity] = useState("1");
  const [partNote, setPartNote] = useState("");
  const [partError, setPartError] = useState("");
  const [minutes, setMinutes] = useState("");
  const [timeNote, setTimeNote] = useState("");
  const [timeError, setTimeError] = useState("");

  const usagesQuery = useQuery({
    queryKey: ["part-usages", workOrderId],
    queryFn: () => getPartUsages(String(workOrderId), token),
    enabled: Boolean(token),
  });

  const timeQuery = useQuery({
    queryKey: ["time-logs", workOrderId],
    queryFn: () => getTimeLogs(String(workOrderId), token),
    enabled: Boolean(token),
  });

  const partsQuery = useQuery({
    queryKey: ["parts", "active"],
    queryFn: () => getParts(token, { active: true }),
    enabled: Boolean(token && canLog),
  });

  const selectedPart = partsQuery.data?.find((part) => part.id === partId);

  const partMutation = useMutation({
    mutationFn: () => {
      const qty = Number(quantity);
      if (!partId || !Number.isInteger(qty) || qty < 1) {
        throw new ApiError(400, "Select a part and enter a whole quantity of at least 1.");
      }
      return createPartUsage({
        workOrder: { id: workOrderId },
        part: { id: partId },
        quantity: qty,
        unitCost: selectedPart?.unitCost ?? 0,
        ...(partNote.trim() ? { note: partNote.trim() } : {}),
      }, token);
    },
    onSuccess: () => {
      setPartError("");
      setQuantity("1");
      setPartNote("");
      client.invalidateQueries({ queryKey: ["part-usages", workOrderId] });
      client.invalidateQueries({ queryKey: ["parts"] });
    },
    onError: (caught) => setPartError(caught instanceof ApiError ? caught.message : "Unable to log part."),
  });

  const timeMutation = useMutation({
    mutationFn: () => {
      if (!/^\d+$/.test(minutes.trim()) || Number(minutes) < 1) {
        throw new ApiError(400, "Minutes must be a whole number greater than 0.");
      }
      return createTimeLog({
        workOrder: { id: workOrderId },
        minutes: Number(minutes),
        ...(timeNote.trim() ? { note: timeNote.trim() } : {}),
      }, token);
    },
    onSuccess: () => {
      setTimeError("");
      setMinutes("");
      setTimeNote("");
      client.invalidateQueries({ queryKey: ["time-logs", workOrderId] });
    },
    onError: (caught) => setTimeError(caught instanceof ApiError ? caught.message : "Unable to log time."),
  });

  return (
    <div className="history-list">
      <div>
        <p className="eyebrow">PARTS USED</p>
        {usagesQuery.isLoading ? <LoadingState label="Loading parts..." /> :
          usagesQuery.isError ? <ErrorState message="Unable to load parts used." /> :
          !usagesQuery.data?.length ? <EmptyState message="No parts recorded." /> : (
            <ol className="history-list">
              {usagesQuery.data.map((item) => (
                <li key={item.id} className="history-item">
                  <div className="history-meta">
                    <span className="history-time">{formatDate(item.usedAt)}</span>
                    <span className="history-by">{personName(item.usedBy)}</span>
                  </div>
                  <strong>{item.part?.partNumber ?? "Part"} · {item.part?.name ?? "—"}</strong>
                  <p className="history-note">Qty {item.quantity} · unit cost {item.unitCost}</p>
                  {item.note && <p className="history-note">{item.note}</p>}
                </li>
              ))}
            </ol>
          )}
      </div>

      <div>
        <p className="eyebrow">TIME LOGGED</p>
        {timeQuery.isLoading ? <LoadingState label="Loading time logs..." /> :
          timeQuery.isError ? <ErrorState message="Unable to load time logs." /> :
          !timeQuery.data?.length ? <EmptyState message="No time logs recorded." /> : (
            <ol className="history-list">
              {timeQuery.data.map((item) => (
                <li key={item.id} className="history-item">
                  <div className="history-meta">
                    <span className="history-time">{formatDate(item.loggedAt)}</span>
                    <span className="history-by">{personName(item.technician)}</span>
                  </div>
                  <strong>{item.minutes} minutes</strong>
                  {item.note && <p className="history-note">{item.note}</p>}
                </li>
              ))}
            </ol>
          )}
      </div>

      {canLog && (
        <form
          className="form-card"
          onSubmit={(event) => { event.preventDefault(); setPartError(""); partMutation.mutate(); }}
        >
          <p className="eyebrow">LOG PART</p>
          <label>
            Part
            <select value={partId} onChange={(e) => setPartId(e.target.value ? Number(e.target.value) : "")} required>
              <option value="" disabled>Select part</option>
              {partsQuery.data?.map((part) => (
                <option key={part.id} value={part.id}>
                  {part.partNumber} — {part.name} (stock {part.stockQuantity})
                </option>
              ))}
            </select>
          </label>
          <div className="form-grid">
            <label>
              Quantity
              <input inputMode="numeric" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </label>
            <label>
              Note
              <input value={partNote} onChange={(e) => setPartNote(e.target.value)} placeholder="Optional" />
            </label>
          </div>
          {partError && <p className="form-error" role="alert">{partError}</p>}
          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={partMutation.isPending}>
              {partMutation.isPending ? "Logging..." : "Log part"}
            </button>
          </div>
        </form>
      )}

      {canLog && (
        <form
          className="form-card"
          onSubmit={(event) => { event.preventDefault(); setTimeError(""); timeMutation.mutate(); }}
        >
          <p className="eyebrow">LOG TIME</p>
          <div className="form-grid">
            <label>
              Minutes
              <input inputMode="numeric" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="Minutes" required />
            </label>
            <label>
              Note
              <input value={timeNote} onChange={(e) => setTimeNote(e.target.value)} placeholder="Optional" />
            </label>
          </div>
          {timeError && <p className="form-error" role="alert">{timeError}</p>}
          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={timeMutation.isPending}>
              {timeMutation.isPending ? "Logging..." : "Log time"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
