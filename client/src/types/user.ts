export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  role: UserRole;
  status: 'Active' | 'Inactive' | 'Pending';
  lastLogin?: string;
  createdAt: string;
  assignedAssets: number;
  office: string;
  avatar?: string;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
  description: string;
  isSystem: boolean;
}

export interface Permission {
  id: string;
  name: string;
  module: string;
  actions: string[]; // ['read', 'write', 'delete', 'admin']
}