import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/common/Feedback";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAuth } from "../features/auth/AuthContext";
import { getWorkOrders } from "../services/workOrderApi";

export function MyJobsPage() {
  const { token, user } = useAuth();

  const query = useQuery({
    queryKey: ["my-jobs", user?.id],
    queryFn: () => getWorkOrders({ assignedToId: Number(user?.id) }, token!),
    enabled: Boolean(token && user?.id),
  });

  return (
    <div className="field-page">
      <div className="field-hero">
        <p className="eyebrow">TODAY'S ASSIGNMENTS</p>
        <h1>My Jobs</h1>
        <p>Work orders assigned to you.</p>
      </div>

      {query.isLoading ? <LoadingState label="Loading your jobs..." /> :
        query.isError ? <ErrorState message="Unable to load jobs. Please try again." /> :
        !query.data?.length ? <EmptyState message="No jobs assigned to you." /> : (
          <div className="job-list">
            {query.data.map((job) => (
              <Link className="job-card" key={job.id} to={`/my-jobs/${job.id}`}>
                <div><small>WORK ORDER</small><strong>{job.code}</strong></div>
                <StatusBadge status={job.status} />
                <h2>{job.title}</h2>
                <p><MapPin size={16} />{job.site?.name ?? "—"}{job.site?.city ? `, ${job.site.city}` : ""}</p>
                <footer>
                  <span>{job.priority}</span>
                  <span>SLA: {job.slaDueAt ? new Date(job.slaDueAt).toLocaleDateString() : "Not set"}</span>
                  <ArrowRight size={19} />
                </footer>
              </Link>
            ))}
          </div>
        )}
    </div>
  );
}
