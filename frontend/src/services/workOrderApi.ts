import { apiClient } from "./apiClient";
import type { PageResponse, WorkOrder, WorkOrderStatus } from "../types/workOrder";

export interface WorkOrderParams { page?: number; size?: number; search?: string; status?: string; priority?: string }

export function getWorkOrders(params: WorkOrderParams, token: string) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => value && query.set(key, String(value)));
  return apiClient<PageResponse<WorkOrder>>(`/api/work-orders?${query.toString()}`, {}, token);
}

export function getWorkOrder(id: string, token: string) {
  return apiClient<WorkOrder>(`/api/work-orders/${id}`, {}, token);
}

export function changeWorkOrderStatus(id: string, status: WorkOrderStatus, token: string) {
  return apiClient<WorkOrder>(`/api/work-orders/${id}/status`, { method: "POST", body: JSON.stringify({ status }) }, token);
}
