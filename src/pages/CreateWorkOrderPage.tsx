import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorState, LoadingState } from "../components/common/Feedback";
import { useAuth } from "../features/auth/AuthContext";
import { ApiError } from "../services/apiClient";
import { createWorkOrder, getCustomers, getSitesByCustomer } from "../services/workOrderApi";

export function CreateWorkOrderPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const client = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [customerId, setCustomerId] = useState<number | "">("");
  const [siteId, setSiteId] = useState<number | "">("");
  const [error, setError] = useState("");

  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomers(token!),
    enabled: Boolean(token),
  });

  const sitesQuery = useQuery({
    queryKey: ["sites", customerId],
    queryFn: () => getSitesByCustomer(customerId as number, token!),
    enabled: Boolean(token && customerId),
  });

  const mutation = useMutation({
    mutationFn: () => createWorkOrder({
      code: `WO-${Date.now()}`,
      title,
      description,
      priority,
      customer: { id: customerId },
      site: { id: siteId },
    }, token!),
    onSuccess: (wo) => {
      client.invalidateQueries({ queryKey: ["work-orders"] });
      navigate(`/work-orders/${wo.id}`);
    },
    onError: (caught) => setError(caught instanceof ApiError ? caught.message : "Failed to create work order."),
  });

  function handleCustomerChange(id: number | "") {
    setCustomerId(id);
    setSiteId("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title || !priority || !customerId || !siteId) { setError("All fields are required."); return; }
    mutation.mutate();
  }

  return (
    <div className="page form-page">
      <Link className="back-link" to="/work-orders"><ArrowLeft size={17} />Back to work orders</Link>
      <div className="page-heading">
        <div>
          <p className="eyebrow">WORK ORDERS</p>
          <h1>Create Work Order</h1>
        </div>
      </div>

      {customersQuery.isLoading ? <LoadingState label="Loading form data..." /> :
        customersQuery.isError ? <ErrorState message="Unable to load customers." /> : (
          <form className="form-card" onSubmit={submit}>
            <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter work order title" required /></label>
            <label>Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the work required" rows={4} /></label>

            <div className="form-grid">
              <label>
                Priority
                <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
                  <option value="" disabled>Select priority</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </label>

              <label>
                Customer
                <select value={customerId} onChange={(e) => handleCustomerChange(e.target.value ? Number(e.target.value) : "")} required>
                  <option value="" disabled>Select customer</option>
                  {customersQuery.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>

              <label>
                Site
                <select value={siteId} onChange={(e) => setSiteId(e.target.value ? Number(e.target.value) : "")} required disabled={!customerId}>
                  <option value="" disabled>{customerId ? "Select site" : "Select a customer first"}</option>
                  {sitesQuery.data?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </label>
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="form-actions">
              <Link className="text-button" to="/work-orders">Cancel</Link>
              <button className="primary-button" type="submit" disabled={mutation.isPending}>
                <Save size={17} />{mutation.isPending ? "Creating..." : "Create Work Order"}
              </button>
            </div>
          </form>
        )}
    </div>
  );
}
