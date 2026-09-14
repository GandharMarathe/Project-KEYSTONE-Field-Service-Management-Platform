import { apiClient } from "./apiClient";
import type { WorkOrder, WorkOrderStatus, StatusHistoryItem } from "../types/workOrder";
import type { BackendCustomer, BackendSite } from "../types/workOrder";

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

export function changeWorkOrderStatus(id: string, status: WorkOrderStatus, token: string) {
  return apiClient<WorkOrder>(`/api/work-orders/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  }, token);
}

export function getStatusHistory(workOrderId: string, token: string) {
  return apiClient<StatusHistoryItem[]>(`/api/work-order-status-history?workOrderId=${workOrderId}`, {}, token);
}

export function getCustomers(token: string) {
  return apiClient<BackendCustomer[]>("/api/customers", {}, token);
}

export function getSitesByCustomer(customerId: number, token: string) {
  return apiClient<BackendSite[]>(`/api/sites?customerId=${customerId}`, {}, token);
}

export function createWorkOrder(payload: object, token: string) {
  return apiClient<WorkOrder>("/api/work-orders", { method: "POST", body: JSON.stringify(payload) }, token);
}
