import httpClient from "../utils/httpClient";
import { API_ENDPOINTS } from '../config/api';
import type { User } from "../types/user";

export const getUsers = () => httpClient.get<{ users: User[] }>("/users");
export const createUser = (userData: Partial<User>) => httpClient.post("/users", userData);
export const updateUser = (userId: string, updatedData: Partial<User>) =>
  httpClient.put(`/users/${userId}`, updatedData);
export const deleteUser = (userId: string) =>
  httpClient.delete(`/users/${userId}`);

export const getActiveUsers = async (): Promise<User[]> => {
  try {
    const response = await httpClient.get<{ users: User[] }>(`${API_ENDPOINTS.USERS.LIST}?isActive=true&limit=1000`);
    if (response.data && Array.isArray(response.data.users)) {
      return response.data.users;
    }
    return [];
  } catch (error) {
    console.error('Error fetching active users:', error);
    return [];
  }
};

export const getUsersByIds = async (userIds: string[]): Promise<User[]> => {
  if (!userIds.length) return [];
  try {
    const promises = userIds.map(id => httpClient.get<{ user: User }>(`${API_ENDPOINTS.USERS.GET(id)}`));
    const results = await Promise.allSettled(promises);
    return results
      .filter((result): result is PromiseFulfilledResult<{ user: User }> => result.status === 'fulfilled')
      .map(result => result.value.data.user)
      .filter(Boolean);
  } catch (error) {
    console.error('Error fetching users by IDs:', error);
    return [];
  }
};

export const getUsersForSelection = async (): Promise<Array<{
  _id: string;
  name: string;
  email: string;
  department: string;
}>> => {
  try {
    const users = await getActiveUsers();
    return users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      department: (user as any).department || 'N/A'
    }));
  } catch (error) {
    console.error('Error fetching users for selection:', error);
    return [];
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const response = await httpClient.get<{ user: User }>(API_ENDPOINTS.USERS.GET(id));
    if (response.data && response.data.user) {
      return response.data.user;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
};

export const searchUsers = async (query: string): Promise<User[]> => {
  try {
    const response = await httpClient.get<{ users: User[] }>(`${API_ENDPOINTS.USERS.LIST}?search=${encodeURIComponent(query)}&isActive=true`);
    if (response.data && Array.isArray(response.data.users)) {
      return response.data.users;
    }
    return [];
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};

const userService = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getActiveUsers,
  getUsersByIds,
  getUsersForSelection,
  getUserById,
  searchUsers
};

export default userService;