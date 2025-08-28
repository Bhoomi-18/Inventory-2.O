import httpClient from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';

export interface Permission {
  id: string;
  name: string;
  module: string;
  actions: string[];
}

export interface UserRole {
  isSystem: boolean;
  _id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface CreateRolePayload {
  name: string;
  description: string;
  permissions: Permission[];
}


class RoleService {
  async getRoles(): Promise<UserRole[]> {
    const res = await httpClient.get<UserRole[]>(API_ENDPOINTS.ROLES.LIST);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to fetch roles');
  }

  async createRole(role: CreateRolePayload): Promise<UserRole> {
    const res = await httpClient.post<UserRole>(API_ENDPOINTS.ROLES.CREATE, role);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to create role');
  }

  async updateRole(id: string, role: Partial<UserRole>): Promise<UserRole> {
    const res = await httpClient.put<UserRole>(API_ENDPOINTS.ROLES.UPDATE(id), role);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to update role');
  }

  async deleteRole(id: string): Promise<void> {
    const res = await httpClient.delete(API_ENDPOINTS.ROLES.DELETE(id));
    if (!res.success) throw new Error(res.message || 'Failed to delete role');
  }
}

const roleService = new RoleService();
export default roleService;
