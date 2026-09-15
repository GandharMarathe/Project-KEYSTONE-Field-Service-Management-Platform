import { apiClient } from "./apiClient";
import type { PartUsageItem } from "../types/workOrder";

export function getPartUsages(workOrderId: string, token: string) {
  // Listing with no query param is 400.
  return apiClient<PartUsageItem[]>(`/api/part-usages?workOrderId=${workOrderId}`, {}, token);
}

export function createPartUsage(
  payload: {
    workOrder: { id: number };
    part: { id: number };
    quantity: number;
    unitCost: number;
    note?: string;
  },
  token: string,
) {
  // usedBy is set from the JWT. Do not send it.
  return apiClient<PartUsageItem>("/api/part-usages", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}
