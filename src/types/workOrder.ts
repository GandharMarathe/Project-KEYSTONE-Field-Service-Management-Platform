export type WorkOrderStatus =
  | "NEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "COMPLETED"
  | "CLOSED"
  | "CANCELLED";

export interface BackendCustomer { id: number; name: string; email?: string; phone?: string }
export interface BackendSite { id: number; name: string; addressLine1?: string; city?: string; customer?: BackendCustomer }
export interface BackendUser { id: number; email: string; firstName?: string; lastName?: string }

export interface WorkOrder {
  id: number;
  code: string;
  title: string;
  description?: string;
  priority: string;
  status: WorkOrderStatus;
  customer: BackendCustomer;
  site: BackendSite;
  assignedTo?: BackendUser;
  slaDueAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StatusHistoryItem {
  id: number;
  fromStatus?: WorkOrderStatus;
  toStatus: WorkOrderStatus;
  changedBy?: BackendUser;
  changedAt: string;
  note?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
