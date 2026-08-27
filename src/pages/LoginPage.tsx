import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { ApiError } from "../services/apiClient";
import type { Role } from "../types/auth";

export function LoginPage() {
  const { isAuthenticated, login, enterDevelopmentMode } = useAuth();
  const navigate = useNavigate(); const location = useLocation(); const formRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [showPassword, setShowPassword] = useState(false); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  useEffect(() => { if (formRef.current) animate(formRef.current, { opacity: [0, 1], translateY: [24, 0], duration: 650, ease: "out(4)" }); }, []);
  if (isAuthenticated) return <Navigate to="/" replace />;
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError("");
    if (!email || !password) { setError("Email and password are required."); return; }
    setLoading(true);
    try { await login(email, password); navigate((location.state as { from?: string })?.from ?? "/", { replace: true }); }
    catch (caught) { setError(caught instanceof ApiError ? caught.message : "Unable to sign in. Please try again."); }
    finally { setLoading(false); }
  }
  const developmentAccessEnabled = import.meta.env.DEV && import.meta.env.VITE_ENABLE_UI_DEV_ACCESS === "true";
  function enter(role: Role) { enterDevelopmentMode(role); navigate("/", { replace: true }); }
  return <div className="auth-page"><section className="auth-aside"><span className="brand"><span className="brand-mark">K</span>KEYSTONE</span><div><p className="eyebrow">FIELD SERVICE MANAGEMENT</p><h1>Bring every job into clear view.</h1><p>Dispatch, field work, and service delivery in one focused operational workspace.</p></div><small>Meridian Facilities Management</small></section><section className="login-panel"><div className="login-card" ref={formRef}><p className="eyebrow">WELCOME BACK</p><h2>Sign in to KEYSTONE</h2><p className="muted">Use your Meridian Facilities Management account.</p><form onSubmit={submit} noValidate><label>Email<div className="input-wrap"><Mail size={17} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" /></div></label><label>Password<div className="input-wrap"><LockKeyhole size={17} /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" /><button type="button" className="input-action" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="primary-button full" disabled={loading}>{loading ? "Signing in..." : <>Sign in <ArrowRight size={18} /></>}</button></form>{developmentAccessEnabled && <div className="dev-access"><span>UI development access</span><p>API calls remain disabled—this does not create a JWT.</p><div>{(["DISPATCHER", "TECHNICIAN", "MANAGER", "CUSTOMER"] as Role[]).map((role) => <button type="button" key={role} onClick={() => enter(role)}>View {role.toLowerCase()}</button>)}</div></div>}<p className="login-note">Authentication is handled by the KEYSTONE API.</p></div></section></div>;
}
