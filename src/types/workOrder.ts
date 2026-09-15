export type WorkOrderStatus =
  | "NEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "COMPLETED"
  | "CLOSED"
  | "CANCELLED";

export interface BackendCustomer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  active?: boolean;
}
export interface BackendSite {
  id: number;
  name: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  active?: boolean;
  customer?: BackendCustomer;
}
export interface BackendUser { id: number; email: string; firstName?: string; lastName?: string }

export interface BackendPart {
  id: number;
  partNumber: string;
  name: string;
  description?: string;
  unitCost: number;
  stockQuantity: number;
  active?: boolean;
}

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

export interface PartUsageItem {
  id: number;
  quantity: number;
  unitCost: number;
  note?: string;
  usedAt: string;
  part?: BackendPart;
  usedBy?: BackendUser;
}

export interface TimeLogItem {
  id: number;
  minutes: number;
  note?: string;
  loggedAt: string;
  technician?: BackendUser;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
