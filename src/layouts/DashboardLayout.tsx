import { Bell, ClipboardList, LayoutDashboard, LogOut, Menu, Package, PanelLeftClose, Settings, Users, Wrench, X, ChartNoAxesCombined, MapPinned, Columns3 } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../features/auth/AuthContext";
import type { Role } from "../types/auth";

type Item = { to: string; label: string; icon: typeof LayoutDashboard; roles: Role[] };
const items: Item[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["DISPATCHER", "MANAGER"] },
  { to: "/work-orders", label: "Work Orders", icon: ClipboardList, roles: ["DISPATCHER", "MANAGER"] },
  { to: "/dispatch", label: "Dispatch Board", icon: Columns3, roles: ["DISPATCHER", "MANAGER"] },
  { to: "/customers", label: "Customers", icon: Users, roles: ["DISPATCHER", "MANAGER"] },
  { to: "/sites", label: "Sites", icon: MapPinned, roles: ["DISPATCHER", "MANAGER"] },
  { to: "/parts", label: "Parts", icon: Package, roles: ["MANAGER"] },
  { to: "/reports", label: "Reports", icon: ChartNoAxesCombined, roles: ["MANAGER"] },
  { to: "/sla", label: "SLA Monitoring", icon: Wrench, roles: ["MANAGER"] },
];

export function DashboardLayout() {
  const { user, role, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navItems = items.filter((item) => role && item.roles.includes(role));
  return <div className="app-shell">
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      <div className="brand"><span className="brand-mark">K</span><span>KEYSTONE</span><button className="icon-button close-button" onClick={() => setOpen(false)} aria-label="Close navigation"><X /></button></div>
      <p className="workspace-label">OPERATIONS</p>
      <nav>{navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}><Icon size={18} />{label}</NavLink>)}</nav>
      <div className="sidebar-bottom"><NavLink to="/settings" className="nav-link"><Settings size={18} />Settings</NavLink><button className="nav-link logout" onClick={logout}><LogOut size={18} />Log out</button></div>
    </aside>
    {open && <button className="scrim" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    <main className="main"><header className="topbar"><button className="icon-button menu-button" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu /></button><div className="topbar-spacer" /><button className="icon-button" aria-label="Notifications"><Bell size={20} /><span className="notification-dot" /></button><div className="user-chip"><span>{user?.email?.slice(0, 1).toUpperCase() ?? "U"}</span><div><strong>{user?.email ?? "User"}</strong><small>{role?.replace("_", " ")}</small></div></div></header><Outlet /></main>
  </div>;
}
