import type { UserRole } from "@/constants/roles";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  role: UserRole;
  rememberMe: boolean;
}