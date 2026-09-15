import { apiClient, ApiError } from "./apiClient";
import type { Role } from "../types/auth";
import type { WorkOrder, WorkOrderStatus, StatusHistoryItem } from "../types/workOrder";

export interface WorkOrderParams { page?: number; size?: number; customerId?: number; siteId?: number; assignedToId?: number }

export async function getWorkOrders(params: WorkOrderParams, token: string): Promise<WorkOrder[]> {
  const query = new URLSearchParams();
  if (params.customerId) query.set("customerId", String(params.customerId));
  if (params.siteId) query.set("siteId", String(params.siteId));
  if (params.assignedToId) query.set("assignedToId", String(params.assignedToId));
  return apiClient<WorkOrder[]>(`/api/work-orders?${query.toString()}`, {}, token);
}

export function getWorkOrder(id: string, token: string) {
  return apiClient<WorkOrder>(`/api/work-orders/${id}`, {}, token);
}

export async function changeWorkOrderStatus(
  workOrder: WorkOrder,
  status: WorkOrderStatus,
  token: string,
  role: Role | null,
  note?: string,
) {
  // Capture fromStatus before PUT. The history API does not infer it, and after
  // PUT the work order already has the new status, so guessing would record to → to.
  const fromStatus = workOrder.status;

  // Technicians may only send status. Manager/dispatcher PUT copies code/title/
  // description/priority/SLA from the body, so a status-only payload would wipe those fields.
  const body = role === "TECHNICIAN"
    ? { status }
    : buildManagerStatusPayload(workOrder, status);

  const updated = await apiClient<WorkOrder>(`/api/work-orders/${workOrder.id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  }, token);

  try {
    await createStatusHistory({
      workOrder: { id: workOrder.id },
      fromStatus,
      toStatus: status,
      note,
    }, token);
  } catch (caught) {
    const statusCode = caught instanceof ApiError ? caught.status : 0;
    throw new ApiError(statusCode, "Status updated, but the timeline could not be recorded.");
  }

  return updated;
}

export async function assignWorkOrder(
  workOrder: WorkOrder,
  technicianId: number,
  token: string,
) {
  const fromStatus = workOrder.status;
  const toStatus: WorkOrderStatus = fromStatus === "NEW" ? "ASSIGNED" : fromStatus;
  const note = fromStatus === "NEW" ? "Assigned" : "Reassigned";

  const body = {
    ...buildManagerStatusPayload(workOrder, toStatus),
    assignedTo: { id: technicianId },
  };

  const updated = await apiClient<WorkOrder>(`/api/work-orders/${workOrder.id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  }, token);

  try {
    await createStatusHistory({
      workOrder: { id: workOrder.id },
      fromStatus,
      toStatus,
      note,
    }, token);
  } catch (caught) {
    const statusCode = caught instanceof ApiError ? caught.status : 0;
    throw new ApiError(statusCode, "Technician assigned, but the timeline could not be recorded.");
  }

  return updated;
}

function buildManagerStatusPayload(workOrder: WorkOrder, status: WorkOrderStatus) {
  if (!workOrder.customer?.id || !workOrder.site?.id) {
    throw new ApiError(400, "Work order is missing customer or site data required to update status.");
  }

  return {
    code: workOrder.code,
    title: workOrder.title,
    description: workOrder.description,
    priority: workOrder.priority,
    status,
    slaDueAt: workOrder.slaDueAt ?? null,
    customer: { id: workOrder.customer.id },
    site: { id: workOrder.site.id },
    // Omit assignedTo when unassigned so the controller leaves the current assignee unchanged.
    ...(workOrder.assignedTo ? { assignedTo: { id: workOrder.assignedTo.id } } : {}),
  };
}

export function getStatusHistory(workOrderId: string, token: string) {
  return apiClient<StatusHistoryItem[]>(`/api/work-order-status-history?workOrderId=${workOrderId}`, {}, token);
}

export function createStatusHistory(
  payload: {
    workOrder: { id: number };
    fromStatus?: WorkOrderStatus;
    toStatus: WorkOrderStatus;
    note?: string;
  },
  token: string,
) {
  // changedBy and changedAt are set by the API from the JWT and @PrePersist.
  return apiClient<StatusHistoryItem>("/api/work-order-status-history", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export { getCustomers } from "./customerApi";
export { getSitesByCustomer } from "./siteApi";

export function createWorkOrder(payload: object, token: string) {
  return apiClient<WorkOrder>("/api/work-orders", { method: "POST", body: JSON.stringify(payload) }, token);
}
