import { apiClient } from "./apiClient";
import type { BackendPart } from "../types/workOrder";

export interface PartPayload {
  partNumber: string;
  name: string;
  description?: string | null;
  unitCost: number;
  stockQuantity: number;
  active: boolean;
}

export function getParts(token: string, options?: { name?: string; active?: boolean }) {
  const query = new URLSearchParams();
  if (options?.name) query.set("name", options.name);
  if (options?.active) query.set("active", "true");
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiClient<BackendPart[]>(`/api/parts${suffix}`, {}, token);
}

export function createPart(payload: PartPayload, token: string) {
  return apiClient<BackendPart>("/api/parts", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export function updatePart(id: number, payload: PartPayload, token: string) {
  return apiClient<BackendPart>(`/api/parts/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }, token);
}

export function deletePart(id: number, token: string) {
  return apiClient<void>(`/api/parts/${id}`, { method: "DELETE" }, token);
}

export function toPartPayload(fields: {
  partNumber: string;
  name: string;
  description: string;
  unitCost: number;
  stockQuantity: number;
  active: boolean;
}): PartPayload {
  return {
    partNumber: fields.partNumber.trim(),
    name: fields.name.trim(),
    description: fields.description.trim() || null,
    unitCost: fields.unitCost,
    stockQuantity: fields.stockQuantity,
    active: fields.active,
  };
}
