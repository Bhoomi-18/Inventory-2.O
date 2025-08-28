import { useState, useEffect, useCallback } from "react";
import * as userService from "../services/userService";
import type { User } from "../types/user";

interface ApiResponseList {
  data: User[];
}
interface ApiResponseSingle {
  data: User;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.getUsers();
      const apiRes = res.data as ApiResponseList;
      setUsers(apiRes.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(
    async (user: Partial<User>) => {
      try {
        const res = await userService.createUser(user);
        const apiRes = res.data as ApiResponseSingle;
        setUsers((prev) => [...prev, apiRes.data]);
        return true;
      } catch (err: any) {
        setError(err.message || "Failed to create user");
        return false;
      }
    },
    []
  );

  const updateUser = useCallback(
    async (id: string, updates: Partial<User>) => {
      try {
        const res = await userService.updateUser(id, updates);
        const apiRes = res.data as ApiResponseSingle;
        setUsers((prev) => prev.map((u) => (u._id === id ? apiRes.data : u)));
        return true;
      } catch (err: any) {
        setError(err.message || "Failed to update user");
        return false;
      }
    },
    []
  );

  const deleteUser = useCallback(
    async (id: string) => {
      try {
        await userService.deleteUser(id);
        setUsers((prev) => prev.filter((u) => u._id !== id));
        return true;
      } catch (err: any) {
        setError(err.message || "Failed to delete user");
        return false;
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, fetchUsers, createUser, updateUser, deleteUser };
}
