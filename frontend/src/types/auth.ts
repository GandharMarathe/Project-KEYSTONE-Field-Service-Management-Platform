export type Role = "DISPATCHER" | "TECHNICIAN" | "MANAGER" | "CUSTOMER";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
