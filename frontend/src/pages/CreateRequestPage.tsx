import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { ErrorState, LoadingState } from "../components/common/Feedback";
import { useAuth } from "../features/auth/AuthContext";
import { getSites } from "../services/siteApi";

const SUBMIT_UNAVAILABLE = "Request submission is not available for the customer role on the current API.";

export function CreateRequestPage() {
  const { token } = useAuth();
  const [siteId, setSiteId] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");

  const sitesQuery = useQuery({
    queryKey: ["sites"],
    queryFn: () => getSites(token!),
    enabled: Boolean(token),
  });

  return (
    <div className="field-page form-page">
      <Link className="back-link" to="/portal/requests"><ArrowLeft size={17} />Back to requests</Link>
      <div className="field-hero">
        <p className="eyebrow">CUSTOMER PORTAL</p>
        <h1>Create Request</h1>
        <p>Submit a request for a site. The current API does not accept customer-created work orders.</p>
      </div>

      {sitesQuery.isLoading ? <LoadingState label="Loading sites..." /> :
        sitesQuery.isError ? <ErrorState message="Unable to load sites." /> : (
          <form className="form-card" onSubmit={(event) => event.preventDefault()}>
            <label>
              Site
              <select value={siteId} onChange={(e) => setSiteId(e.target.value ? Number(e.target.value) : "")}>
                <option value="" disabled>Select a site</option>
                {sitesQuery.data?.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}{site.city ? ` · ${site.city}` : ""}
                  </option>
                ))}
              </select>
              <small>Site list is every site on the API. There is no customer-to-user link to show only yours.</small>
            </label>
            <label>
              Title
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter request title" />
            </label>
            <label>
              Description
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder="Describe the problem" />
            </label>
            <label>
              Priority
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="" disabled>Select priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </label>
            <p className="form-error" role="status">{SUBMIT_UNAVAILABLE}</p>
            <button className="primary-button full" type="submit" disabled>
              <Send size={17} />Submit Request
            </button>
          </form>
        )}
    </div>
  );
}
