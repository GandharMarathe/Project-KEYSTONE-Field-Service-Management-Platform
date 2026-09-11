import { AlertTriangle, ArrowUpRight, ClipboardList, Clock3, ShieldAlert } from "lucide-react";
import { AnimatedEntrance } from "../components/common/AnimatedEntrance";
import { EmptyState, ErrorState, LoadingState } from "../components/common/Feedback";
import { useAuth } from "../features/auth/AuthContext";
import { apiClient } from "../services/apiClient";
import { useQuery } from "@tanstack/react-query";

interface Summary { openWorkOrders?: number; unassigned?: number; slaAtRisk?: number; completedToday?: number }
export function DashboardPage() {
  const { token, role } = useAuth();
  const summary = useQuery({ queryKey: ["summary"], queryFn: () => apiClient<Summary>("/api/reports/summary", {}, token), enabled: Boolean(token) });
  return <div className="page"><AnimatedEntrance><div className="page-heading"><div><p className="eyebrow">{role === "MANAGER" ? "MANAGEMENT OVERVIEW" : "OPERATIONS OVERVIEW"}</p><h1>Dashboard</h1><p>Live operational information from the KEYSTONE API.</p></div><button className="outline-button">View reports <ArrowUpRight size={16} /></button></div></AnimatedEntrance>
    {summary.isLoading ? <LoadingState label="Loading dashboard..." /> : summary.isError ? <ErrorState message="Unable to load dashboard. Please try again." /> : <AnimatedEntrance className="dashboard-content"><section className="stats-grid"><Stat icon={ClipboardList} label="Open Work Orders" value={summary.data?.openWorkOrders} /><Stat icon={Clock3} label="Unassigned" value={summary.data?.unassigned} /><Stat icon={AlertTriangle} label="SLA At Risk" value={summary.data?.slaAtRisk} warn /><Stat icon={ShieldAlert} label="Completed Today" value={summary.data?.completedToday} /></section><section className="dashboard-panels"><div className="panel chart-placeholder"><div><p className="eyebrow">LIVE REPORTING</p><h2>Work Orders by Status</h2></div><div className="graph-lines" aria-hidden="true"><i /><i /><i /><i /></div><p>{summary.data ? "Chart data will render when provided by the report contract." : "No report data available"}</p></div><div className="panel"><p className="eyebrow">SLA COMPLIANCE</p><h2>Service-level status</h2><EmptyState message="No SLA data available" /></div></section></AnimatedEntrance>}
  </div>;
}
function Stat({ icon: Icon, label, value, warn }: { icon: typeof ClipboardList; label: string; value?: number; warn?: boolean }) { return <article className={`stat-card ${warn ? "warn" : ""}`}><span className="stat-icon"><Icon size={19} /></span><p>{label}</p><strong>{value ?? "--"}</strong><small>API-provided value</small></article>; }
