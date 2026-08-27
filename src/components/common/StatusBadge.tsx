import { CircleAlert, CircleCheck, CircleDot, PauseCircle, XCircle } from "lucide-react";
import type { WorkOrderStatus } from "../../types/workOrder";

const icons: Record<WorkOrderStatus, typeof CircleDot> = { NEW: CircleDot, ASSIGNED: CircleDot, IN_PROGRESS: CircleAlert, ON_HOLD: PauseCircle, COMPLETED: CircleCheck, CLOSED: CircleCheck, CANCELLED: XCircle };
export function StatusBadge({ status }: { status: WorkOrderStatus }) {
  const Icon = icons[status];
  return <span className={`badge status-${status.toLowerCase()}`}><Icon size={13} />{status.replace("_", " ")}</span>;
}
