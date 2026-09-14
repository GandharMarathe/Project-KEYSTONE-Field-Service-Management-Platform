import { apiClient } from "./apiClient";
import type { LoginResponse } from "../types/auth";

interface BackendLoginResponse {
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  role: string;
}

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const raw = await apiClient<BackendLoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return {
    token: raw.token,
    user: {
      id: String(raw.userId),
      email: raw.email,
      role: raw.role.replace("ROLE_", "") as LoginResponse["user"]["role"],
    },
  };
}
