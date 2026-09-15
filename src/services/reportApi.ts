import { apiClient } from "./apiClient";

export interface ReportSummary {
  total?: number;
  new?: number;
  assigned?: number;
  inProgress?: number;
  onHold?: number;
  completed?: number;
  closed?: number;
  cancelled?: number;
}

export function getReportSummary(token: string) {
  return apiClient<ReportSummary>("/api/reports/summary", {}, token);
}
