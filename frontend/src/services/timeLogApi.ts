import { apiClient } from "./apiClient";
import type { TimeLogItem } from "../types/workOrder";

export function getTimeLogs(workOrderId: string, token: string) {
  return apiClient<TimeLogItem[]>(`/api/time-logs?workOrderId=${workOrderId}`, {}, token);
}

export function createTimeLog(
  payload: {
    workOrder: { id: number };
    minutes: number;
    note?: string;
  },
  token: string,
) {
  // technician is set from the JWT. Do not send it.
  return apiClient<TimeLogItem>("/api/time-logs", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}
