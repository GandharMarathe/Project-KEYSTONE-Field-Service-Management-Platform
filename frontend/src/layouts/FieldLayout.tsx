import { Bell, ClipboardList, LogOut, UserRound } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export function FieldLayout() {
  const { logout } = useAuth();
  return <div className="field-shell"><header className="field-header"><span className="brand"><span className="brand-mark">K</span>KEYSTONE</span><button className="icon-button" aria-label="Notifications"><Bell size={20} /></button></header><main className="field-main"><Outlet /></main><nav className="mobile-nav"><NavLink to="/my-jobs"><ClipboardList size={19} />My Jobs</NavLink><NavLink to="/notifications"><Bell size={19} />Alerts</NavLink><NavLink to="/profile"><UserRound size={19} />Profile</NavLink><button onClick={logout}><LogOut size={19} />Log out</button></nav></div>;
}
