import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BriefcaseBusiness, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/common/Feedback";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAuth } from "../features/auth/AuthContext";
import { getWorkOrders } from "../services/workOrderApi";

export function MyJobsPage() {
  const { token } = useAuth(); const query = useQuery({ queryKey: ["my-jobs"], queryFn: () => getWorkOrders({ page: 0, size: 20 }, token!), enabled: Boolean(token) });
  return <div className="field-page"><div className="field-hero"><p className="eyebrow">TODAY'S ASSIGNMENTS</p><h1>My Jobs</h1><p>Only work orders assigned to you are shown here.</p></div>{query.isLoading ? <LoadingState label="Loading assigned jobs..." /> : query.isError ? <ErrorState message="Unable to load assigned jobs. Please try again." /> : !query.data?.content.length ? <EmptyState message="No work orders available." /> : <div className="job-list">{query.data.content.map((job) => <Link className="job-card" key={job.id} to={`/my-jobs/${job.id}`}><div><small>WORK ORDER</small><strong>{job.code}</strong></div><StatusBadge status={job.status} /><h2>{job.title}</h2><p><MapPin size={16} />{job.siteId || "Site Address"}</p><footer><span>{job.priority}</span><span>SLA: {job.slaDueDate || "SLA due date"}</span><ArrowRight size={19} /></footer></Link>)}</div>}</div>;
}
