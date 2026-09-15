import { apiClient } from "./apiClient";
import type { BackendCustomer } from "../types/workOrder";

export interface CustomerPayload {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  active: boolean;
}

export function getCustomers(token: string) {
  return apiClient<BackendCustomer[]>("/api/customers", {}, token);
}

export function createCustomer(payload: CustomerPayload, token: string) {
  return apiClient<BackendCustomer>("/api/customers", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export function updateCustomer(id: number, payload: CustomerPayload, token: string) {
  return apiClient<BackendCustomer>(`/api/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }, token);
}

export function deleteCustomer(id: number, token: string) {
  return apiClient<void>(`/api/customers/${id}`, { method: "DELETE" }, token);
}

export function toCustomerPayload(fields: {
  name: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
}): CustomerPayload {
  // Omit blank optional strings so @Email does not reject "".
  return {
    name: fields.name.trim(),
    email: fields.email.trim() || null,
    phone: fields.phone.trim() || null,
    address: fields.address.trim() || null,
    active: fields.active,
  };
}
