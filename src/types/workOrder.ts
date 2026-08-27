export type WorkOrderStatus =
  | "NEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "COMPLETED"
  | "CLOSED"
  | "CANCELLED";

export interface WorkOrder {
  id: string;
  code: string;
  title: string;
  description: string;
  priority: string;
  status: WorkOrderStatus;
  customerId: string;
  siteId: string;
  assigneeId?: string;
  slaDueDate?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface StatusHistoryItem {
  id: string;
  fromStatus?: WorkOrderStatus;
  toStatus: WorkOrderStatus;
  changedBy?: string;
  changedAt: string;
  note?: string;
}
