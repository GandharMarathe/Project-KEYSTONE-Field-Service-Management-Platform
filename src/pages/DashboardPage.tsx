import { AlertTriangle, ArrowUpRight, ClipboardList, Clock3, ShieldAlert, CheckCircle2 } from "lucide-react";
import { AnimatedEntrance } from "../components/common/AnimatedEntrance";
import { EmptyState, ErrorState, LoadingState } from "../components/common/Feedback";
import { useAuth } from "../features/auth/AuthContext";
import { apiClient } from "../services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

interface Summary {
  total?: number;
  new?: number;
  assigned?: number;
  inProgress?: number;
  onHold?: number;
  completed?: number;
  closed?: number;
  cancelled?: number;
}

export function DashboardPage() {
  const { token, role } = useAuth();

  const summary = useQuery({
    queryKey: ["summary"],
    queryFn: () => apiClient<Summary>("/api/reports/summary", {}, token),
    enabled: Boolean(token),
  });

  return (
    <div className="page">
      <AnimatedEntrance>
        <div className="page-heading">
          <div>
            <p className="eyebrow">{role === "MANAGER" ? "MANAGEMENT OVERVIEW" : "OPERATIONS OVERVIEW"}</p>
            <h1>Dashboard</h1>
            <p>Live operational data from the API.</p>
          </div>
          <Link className="outline-button" to="/work-orders">View all work orders <ArrowUpRight size={16} /></Link>
        </div>
      </AnimatedEntrance>

      {summary.isLoading ? <LoadingState label="Loading dashboard..." /> :
        summary.isError ? <ErrorState message="Unable to load dashboard data." /> : (
          <AnimatedEntrance className="dashboard-content">
            <section className="stats-grid">
              <Stat icon={ClipboardList} label="Total Work Orders" value={summary.data?.total} />
              <Stat icon={Clock3} label="In Progress" value={summary.data?.inProgress} />
              <Stat icon={AlertTriangle} label="On Hold" value={summary.data?.onHold} warn />
              <Stat icon={CheckCircle2} label="Completed" value={summary.data?.completed} />
            </section>

            <section className="dashboard-panels">
              <div className="panel">
                <p className="eyebrow">STATUS BREAKDOWN</p>
                <h2>Work orders by status</h2>
                {summary.data ? (
                  <table className="summary-table">
                    <tbody>
                      {([
                        ["New", summary.data.new],
                        ["Assigned", summary.data.assigned],
                        ["In Progress", summary.data.inProgress],
                        ["On Hold", summary.data.onHold],
                        ["Completed", summary.data.completed],
                        ["Closed", summary.data.closed],
                        ["Cancelled", summary.data.cancelled],
                      ] as [string, number | undefined][]).map(([label, count]) => (
                        <tr key={label}>
                          <td>{label}</td>
                          <td><strong>{count ?? 0}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <EmptyState message="No summary data available." />}
              </div>

              <div className="panel">
                <p className="eyebrow">QUICK ACTIONS</p>
                <h2>Jump to</h2>
                <div className="quick-actions">
                  <Link className="outline-button" to="/work-orders/new">Create work order</Link>
                  <Link className="outline-button" to="/dispatch">Open dispatch board</Link>
                  {role === "MANAGER" && <Link className="outline-button" to="/reports">View reports</Link>}
                </div>
              </div>
            </section>
          </AnimatedEntrance>
        )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, warn }: { icon: typeof ClipboardList; label: string; value?: number; warn?: boolean }) {
  return (
    <article className={`stat-card ${warn ? "warn" : ""}`}>
      <span className="stat-icon"><Icon size={19} /></span>
      <p>{label}</p>
      <strong>{value ?? "—"}</strong>
      <small>Live from API</small>
    </article>
  );
}
