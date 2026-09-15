import { ClipboardList, Clock3, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { EmptyState, ErrorState, LoadingState } from "../components/common/Feedback";
import { useAuth } from "../features/auth/AuthContext";
import { getReportSummary } from "../services/reportApi";

const STATUS_ROWS: Array<[string, "new" | "assigned" | "inProgress" | "onHold" | "completed" | "closed" | "cancelled"]> = [
  ["New", "new"],
  ["Assigned", "assigned"],
  ["In Progress", "inProgress"],
  ["On Hold", "onHold"],
  ["Completed", "completed"],
  ["Closed", "closed"],
  ["Cancelled", "cancelled"],
];

export function ReportsPage() {
  const { token } = useAuth();
  const summary = useQuery({
    queryKey: ["summary"],
    queryFn: () => getReportSummary(token!),
    enabled: Boolean(token),
    // Counts change after every status transition; never serve a stale mount.
    staleTime: 0,
    refetchOnMount: "always",
  });

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">MANAGEMENT</p>
          <h1>Reports</h1>
          <p>Work-order counts from the API summary. Revenue and compliance percentages are not in this contract.</p>
        </div>
      </div>

      {summary.isLoading ? <LoadingState label="Loading report..." /> :
        summary.isError ? <ErrorState message="Unable to load report summary." /> :
        !summary.data ? <EmptyState message="No summary data available." /> : (
          <>
            <section className="stats-grid">
              <article className="stat-card">
                <span className="stat-icon"><ClipboardList size={19} /></span>
                <p>Total work orders</p>
                <strong>{summary.data.total ?? "—"}</strong>
                <small>Live from API</small>
              </article>
              <article className="stat-card">
                <span className="stat-icon"><Clock3 size={19} /></span>
                <p>In progress</p>
                <strong>{summary.data.inProgress ?? "—"}</strong>
                <small>Live from API</small>
              </article>
              <article className={`stat-card ${summary.data.onHold ? "warn" : ""}`}>
                <span className="stat-icon"><AlertTriangle size={19} /></span>
                <p>On hold</p>
                <strong>{summary.data.onHold ?? "—"}</strong>
                <small>Live from API</small>
              </article>
              <article className="stat-card">
                <span className="stat-icon"><CheckCircle2 size={19} /></span>
                <p>Completed</p>
                <strong>{summary.data.completed ?? "—"}</strong>
                <small>Live from API</small>
              </article>
            </section>

            <section className="panel">
              <p className="eyebrow">STATUS BREAKDOWN</p>
              <h2>Work orders by status</h2>
              <table className="summary-table">
                <tbody>
                  {STATUS_ROWS.map(([label, key]) => (
                    <tr key={key}>
                      <td>{label}</td>
                      <td><strong>{summary.data?.[key] ?? 0}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
    </div>
  );
}
