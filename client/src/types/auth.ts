export interface Company {
  id: string;
  name: string;
  adminEmail: string;
  createdAt: string;
  isActive: boolean;
}

export interface User {
  _id: string;
  email: string;
  companyId: string;
  companyName: string;
  role: 'admin' | 'user';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  company: Company | null;
  loading: boolean;
  error: string | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  companyName: string;
  adminEmail: string;
  adminPassword: string;
  generalPassword: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  company: Company;
}