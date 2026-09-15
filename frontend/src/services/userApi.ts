import { apiClient } from "./apiClient";
import type { ApiUser, Role } from "../types/auth";

export interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export function getUsers(token: string) {
  return apiClient<ApiUser[]>("/api/users", {}, token);
}

export function createUser(payload: CreateUserPayload, token: string) {
  return apiClient<ApiUser>("/api/users", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}
