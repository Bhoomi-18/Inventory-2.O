export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  office?: string;
  assignedAssets?: number;
  role: string | UserRole;
  status?: string;
  lastLogin?: string;
  createdAt?: string;
}

export interface UserRole {
  _id: string;
  name: string;
  permissions: Permission[];
  description: string;
  isSystem?: boolean;
}

export interface Permission {
  id: string;
  name: string;
  module: string;
  actions: string[];
}