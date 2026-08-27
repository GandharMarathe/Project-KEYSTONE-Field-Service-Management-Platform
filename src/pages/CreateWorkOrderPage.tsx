import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";

export function CreateWorkOrderPage() {
  const [submitted, setSubmitted] = useState(false);
  function submit(event: React.FormEvent) { event.preventDefault(); setSubmitted(true); }
  return <div className="page form-page"><Link className="back-link" to="/work-orders"><ArrowLeft size={17} />Back to work orders</Link><div className="page-heading"><div><p className="eyebrow">WORK ORDERS</p><h1>Create Work Order</h1><p>Complete the fields supported by the API contract.</p></div></div><form className="form-card" onSubmit={submit}><label>Title<input placeholder="Enter work-order title" required /></label><label>Description<textarea placeholder="Enter description" rows={5} required /></label><div className="form-grid"><label>Priority<select defaultValue="" required><option value="" disabled>Select priority</option><option value="LOW">LOW</option><option value="MEDIUM">MEDIUM</option><option value="HIGH">HIGH</option><option value="CRITICAL">CRITICAL</option></select></label><label>Customer<select defaultValue="" required disabled><option value="">Select customer</option></select><small>Customer options load from the API.</small></label><label>Site<select defaultValue="" required disabled><option value="">Select site</option></select><small>Select a customer first.</small></label></div>{submitted && <p className="form-error">Work-order creation will submit to the API once the endpoint contract is connected.</p>}<div className="form-actions"><Link className="text-button" to="/work-orders">Cancel</Link><button className="primary-button" type="submit"><Save size={17} />Create Work Order</button></div></form></div>;
}
