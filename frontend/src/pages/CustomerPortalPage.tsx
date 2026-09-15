import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/common/Feedback";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAuth } from "../features/auth/AuthContext";
import { getWorkOrders } from "../services/workOrderApi";

export function CustomerPortalPage() {
  const { token } = useAuth();

  const query = useQuery({
    queryKey: ["portal-requests"],
    queryFn: () => getWorkOrders({}, token!),
    enabled: Boolean(token),
  });

  return (
    <div className="field-page">
      <div className="field-hero">
        <p className="eyebrow">CUSTOMER PORTAL</p>
        <h1>My Requests</h1>
        <p>Track service requests for your sites.</p>
        <Link className="primary-button" to="/portal/requests/new"><CirclePlus size={18} />Create Request</Link>
      </div>

      {query.isLoading ? <LoadingState label="Loading your requests..." /> :
        query.isError ? <ErrorState message="Unable to load requests. Please try again." /> :
        !query.data?.length ? <EmptyState message="No requests found." /> : (
          <div className="job-list">
            {query.data.map((item) => (
              <Link className="job-card" key={item.id} to={`/portal/requests/${item.id}`}>
                <div><small>REQUEST</small><strong>{item.code}</strong></div>
                <StatusBadge status={item.status} />
                <h2>{item.title}</h2>
                <p>{item.site?.name ?? "—"}{item.site?.city ? `, ${item.site.city}` : ""}</p>
                <footer>
                  <span>{item.priority}</span>
                  <ArrowRight size={19} />
                </footer>
              </Link>
            ))}
          </div>
        )}
    </div>
  );
}
