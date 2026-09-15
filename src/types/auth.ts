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

export interface ApiUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}
