import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/common/Feedback";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAuth } from "../features/auth/AuthContext";
import { getWorkOrders } from "../services/workOrderApi";

export function CustomerPortalPage() {
  const { token } = useAuth(); const query = useQuery({ queryKey: ["portal-requests"], queryFn: () => getWorkOrders({ page: 0, size: 20 }, token!), enabled: Boolean(token) });
  return <div className="field-page"><div className="field-hero"><p className="eyebrow">CUSTOMER PORTAL</p><h1>My Requests</h1><p>Track work orders for your sites.</p><Link className="primary-button" to="/portal/requests/new"><CirclePlus size={18} />Create Request</Link></div>{query.isLoading ? <LoadingState label="Loading your requests..." /> : query.isError ? <ErrorState message="Unable to load your requests. Please try again." /> : !query.data?.content.length ? <EmptyState message="No work orders found." /> : <div className="job-list">{query.data.content.map((item) => <Link className="job-card" key={item.id} to={`/portal/requests/${item.id}`}><div><small>WORK ORDER</small><strong>{item.code}</strong></div><StatusBadge status={item.status} /><h2>{item.title}</h2><p>{item.siteId || "Site Address"}</p><footer><span>{item.priority}</span><ArrowRight size={19} /></footer></Link>)}</div>}</div>;
}
