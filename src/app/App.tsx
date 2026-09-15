import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import type { Role } from "../types/auth";
import { CustomerLayout } from "../layouts/CustomerLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { FieldLayout } from "../layouts/FieldLayout";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { WorkOrdersPage } from "../pages/WorkOrdersPage";
import { DispatchPage } from "../pages/DispatchPage";
import { WorkOrderDetailPage } from "../pages/WorkOrderDetailPage";
import { CreateWorkOrderPage } from "../pages/CreateWorkOrderPage";
import { MyJobsPage } from "../pages/MyJobsPage";
import { CustomerPortalPage } from "../pages/CustomerPortalPage";
import { CreateRequestPage } from "../pages/CreateRequestPage";
import { FeaturePlaceholderPage } from "../pages/FeaturePlaceholderPage";
import { CustomersPage } from "../pages/CustomersPage";
import { SitesPage } from "../pages/SitesPage";
import { PartsPage } from "../pages/PartsPage";
import { UsersPage } from "../pages/UsersPage";
import { ReportsPage } from "../pages/ReportsPage";
import { SlaPage } from "../pages/SlaPage";

function Protected({ children, roles }: { children: React.ReactNode; roles?: Role[] }) { const { isAuthenticated, role } = useAuth(); const location = useLocation(); if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />; if (roles && (!role || !roles.includes(role))) return <Navigate to="/" replace />; return <>{children}</>; }
function Home() { const { role } = useAuth(); if (role === "TECHNICIAN") return <Navigate to="/my-jobs" replace />; if (role === "CUSTOMER") return <Navigate to="/portal/requests" replace />; return <Navigate to="/dashboard" replace />; }

export function App() { return <Routes><Route path="/login" element={<LoginPage />} /><Route element={<Protected roles={["DISPATCHER", "MANAGER"]}><DashboardLayout /></Protected>}><Route path="/dashboard" element={<DashboardPage />} /><Route path="/work-orders" element={<WorkOrdersPage />} /><Route path="/work-orders/new" element={<CreateWorkOrderPage />} /><Route path="/work-orders/:id" element={<WorkOrderDetailPage />} /><Route path="/dispatch" element={<DispatchPage />} /><Route path="/customers" element={<CustomersPage />} /><Route path="/sites" element={<SitesPage />} /><Route path="/parts" element={<Protected roles={["MANAGER"]}><PartsPage /></Protected>} /><Route path="/users" element={<Protected roles={["MANAGER"]}><UsersPage /></Protected>} /><Route path="/reports" element={<Protected roles={["MANAGER"]}><ReportsPage /></Protected>} /><Route path="/sla" element={<Protected roles={["MANAGER"]}><SlaPage /></Protected>} /><Route path="/settings" element={<FeaturePlaceholderPage title="Settings" description="Settings will be available when their API contract is connected." />} /></Route><Route element={<Protected roles={["TECHNICIAN"]}><FieldLayout /></Protected>}><Route path="/my-jobs" element={<MyJobsPage />} /><Route path="/my-jobs/:id" element={<WorkOrderDetailPage />} /><Route path="/notifications" element={<FeaturePlaceholderPage title="Notifications" description="No new notifications." />} /><Route path="/profile" element={<FeaturePlaceholderPage title="Profile" description="Profile data will come from the API." />} /></Route><Route element={<Protected roles={["CUSTOMER"]}><CustomerLayout /></Protected>}><Route path="/portal" element={<Navigate to="/portal/requests" replace />} /><Route path="/portal/requests" element={<CustomerPortalPage />} /><Route path="/portal/requests/new" element={<CreateRequestPage />} /><Route path="/portal/requests/:id" element={<WorkOrderDetailPage />} /><Route path="/portal/profile" element={<FeaturePlaceholderPage title="Profile" description="Profile data will come from the API." />} /></Route><Route path="/" element={<Protected><Home /></Protected>} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>; }
