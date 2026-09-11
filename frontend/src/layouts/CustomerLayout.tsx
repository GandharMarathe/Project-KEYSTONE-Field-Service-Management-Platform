import { CirclePlus, ClipboardList, LogOut, UserRound } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export function CustomerLayout() {
  const { logout } = useAuth();
  return <div className="field-shell portal-shell"><header className="field-header"><span className="brand"><span className="brand-mark">K</span>KEYSTONE</span><span className="portal-label">Customer Portal</span></header><main className="field-main"><Outlet /></main><nav className="mobile-nav"><NavLink to="/portal/requests"><ClipboardList size={19} />Requests</NavLink><NavLink to="/portal/requests/new"><CirclePlus size={19} />Create</NavLink><NavLink to="/profile"><UserRound size={19} />Profile</NavLink><button onClick={logout}><LogOut size={19} />Log out</button></nav></div>;
}
