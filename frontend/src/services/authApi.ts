import { apiClient } from "./apiClient";
import type { LoginResponse } from "../types/auth";

export function loginRequest(email: string, password: string) {
  return apiClient<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
