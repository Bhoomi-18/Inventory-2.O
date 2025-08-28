import React, { useState } from 'react';
import { UserPlus, Shield } from 'lucide-react';
import UserStats from './UserStats';
import UserTable from './UserTable';
import RoleManagement from './RoleManagement';
import UserForm from './UserForm';
import { useUsers } from '../../hooks/useUsers';
import type { User } from '../../types/user';

const Users: React.FC = () => {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers();
  const [showRoles, setShowRoles] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const adminUser = users.find(u =>
    typeof u.role === 'string'
      ? u.role === 'Admin'
      : u.role?.name === 'Admin'
  );
  const otherUsers = users.filter(u => u !== adminUser);

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Delete this user?')) {
      await deleteUser(userId);
    }
  };

  const handleFormSubmit = async (user: Partial<User>) => {
    if (editingUser) {
      await updateUser(editingUser._id, user);
    } else {
      await createUser(user);
    }
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users & Roles</h1>
          <p className="text-gray-600">Manage system users and role permissions</p>
        </div>
        <div className="flex gap-3">
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
            onClick={() => setShowRoles(true)}
          >
            <Shield className="w-4 h-4" />
            Manage Roles
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            onClick={handleAddUser}
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {showRoles ? (
        <RoleManagement onClose={() => setShowRoles(false)} />
      ) : showForm ? (
        <UserForm
          initial={editingUser || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditingUser(null); }}
        />
      ) : (
        <>
          <UserStats />
          <div className="bg-white rounded-lg border border-gray-200">
            {loading ? (
              <div className="p-4 text-gray-500">Loading users...</div>
            ) : error ? (
              <div className="p-4 text-red-500">{error}</div>
            ) : (
              <UserTable
                users={adminUser ? [adminUser, ...otherUsers] : users}
                onViewUser={() => {}}
                onEditUser={handleEditUser}
                onDeactivateUser={handleDeleteUser}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Users;
