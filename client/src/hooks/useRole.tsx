import { useState, useEffect, useCallback } from 'react';
import roleService, { type UserRole, type Permission } from '../services/roleService';

export function useRoles() {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roleService.getRoles();
      setRoles(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  }, []);

  const createRole = useCallback(async (role: Omit<UserRole, 'id'>) => {
    try {
      const created = await roleService.createRole(role);
      setRoles(prev => [...prev, created]);
      return true;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create role');
      return false;
    }
  }, []);

  const updateRole = useCallback(async (id: string, updates: Partial<UserRole>) => {
    try {
      const updated = await roleService.updateRole(id, updates);
      setRoles(prev => prev.map(r => (r._id === id ? updated : r)));
      return true;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update role');
      return false;
    }
  }, []);

  const deleteRole = useCallback(async (id: string) => {
    try {
      await roleService.deleteRole(id);
      setRoles(prev => prev.filter(r => r._id !== id));
      return true;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to delete role');
      return false;
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    loading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole
  };
}

export type { UserRole, Permission };
