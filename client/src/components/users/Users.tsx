import React, { useState } from 'react';
import { UserPlus, Shield } from 'lucide-react';
import UserStats from './UserStats';
import UserTable from './UserTable';
import RoleManagement from './RoleManagement';
import type { User, UserRole } from '../../types';
import { sampleUsers, sampleRoles } from '../../data/mockData';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [roles, setRoles] = useState<UserRole[]>(sampleRoles);
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');

  const handleViewUser = (user: User) => {
    console.log('Viewing user:', user.name);
  };

  const handleEditUser = (user: User) => {
    console.log('Editing user:', user.name);
  };

  const handleDeactivateUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'Inactive' } : user
    ));
  };

  const handleCreateRole = (roleData: Omit<UserRole, 'id'>) => {
    const newRole: UserRole = {
      ...roleData,
      id: String(roles.length + 1)
    };
    setRoles(prev => [...prev, newRole]);
  };

  const handleEditRole = (role: UserRole) => {
    console.log('Editing role:', role.name);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(prev => prev.filter(role => role.id !== roleId));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users & Roles</h1>
          <p className="text-gray-600">Manage system users and role permissions</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700">
            <Shield className="w-4 h-4" />
            Manage Roles
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      <UserStats />

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'users'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'roles'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Roles & Permissions
            </button>
          </nav>
        </div>

        <div className="p-0">
          {activeTab === 'users' ? (
            <UserTable 
              users={users}
              onViewUser={handleViewUser}
              onEditUser={handleEditUser}
              onDeactivateUser={handleDeactivateUser}
            />
          ) : (
            <RoleManagement 
              roles={roles}
              onCreateRole={handleCreateRole}
              onEditRole={handleEditRole}
              onDeleteRole={handleDeleteRole}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;