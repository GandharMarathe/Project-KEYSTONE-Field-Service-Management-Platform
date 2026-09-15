import { apiClient } from "./apiClient";
import type { BackendSite } from "../types/workOrder";

export interface SitePayload {
  name: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string;
  active: boolean;
  customer?: { id: number };
}

export function getSites(token: string) {
  return apiClient<BackendSite[]>("/api/sites", {}, token);
}

export function getSitesByCustomer(customerId: number, token: string) {
  return apiClient<BackendSite[]>(`/api/sites?customerId=${customerId}`, {}, token);
}

export function createSite(payload: SitePayload, token: string) {
  return apiClient<BackendSite>("/api/sites", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export function updateSite(id: number, payload: SitePayload, token: string) {
  return apiClient<BackendSite>(`/api/sites/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }, token);
}

export function deleteSite(id: number, token: string) {
  return apiClient<void>(`/api/sites/${id}`, { method: "DELETE" }, token);
}

export function toCreateSitePayload(fields: {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  active: boolean;
  customerId: number;
}): SitePayload {
  return {
    name: fields.name.trim(),
    addressLine1: fields.addressLine1.trim(),
    addressLine2: fields.addressLine2.trim() || null,
    city: fields.city.trim(),
    state: fields.state.trim() || null,
    postalCode: fields.postalCode.trim() || null,
    country: fields.country.trim(),
    active: fields.active,
    customer: { id: fields.customerId },
  };
}

export function toUpdateSitePayload(fields: {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  active: boolean;
}): SitePayload {
  // PUT does not copy customer or postalCode in the controller.
  return {
    name: fields.name.trim(),
    addressLine1: fields.addressLine1.trim(),
    addressLine2: fields.addressLine2.trim() || null,
    city: fields.city.trim(),
    state: fields.state.trim() || null,
    country: fields.country.trim(),
    active: fields.active,
  };
}
