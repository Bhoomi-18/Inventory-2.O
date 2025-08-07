import React, { useState } from 'react';
import { Shield, Plus, Edit, Trash2 } from 'lucide-react';
import type { UserRole, Permission } from '../../types';

interface RoleManagementProps {
  roles: UserRole[];
  onCreateRole: (role: Omit<UserRole, 'id'>) => void;
  onEditRole: (role: UserRole) => void;
  onDeleteRole: (roleId: string) => void;
}

const RoleManagement: React.FC<RoleManagementProps> = ({ roles, onCreateRole, onEditRole, onDeleteRole }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as Permission[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRole({
      ...newRole,
      isSystem: false
    });
    setNewRole({ name: '', description: '', permissions: [] });
    setShowCreateForm(false);
  };

  const availablePermissions: Permission[] = [
    { id: '1', name: 'Asset Management', module: 'assets', actions: ['read', 'write', 'delete'] },
    { id: '2', name: 'User Management', module: 'users', actions: ['read', 'write'] },
    { id: '3', name: 'Reports', module: 'reports', actions: ['read', 'write'] },
    { id: '4', name: 'Settings', module: 'settings', actions: ['read'] },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Role Management</h3>
        </div>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </div>

      {showCreateForm && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newRole.description}
                  onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
              <div className="grid grid-cols-2 gap-2">
                {availablePermissions.map((permission) => (
                  <label key={permission.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewRole(prev => ({
                            ...prev,
                            permissions: [...prev.permissions, permission]
                          }));
                        } else {
                          setNewRole(prev => ({
                            ...prev,
                            permissions: prev.permissions.filter(p => p.id !== permission.id)
                          }));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{permission.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
              >
                Create Role
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="divide-y divide-gray-200">
        {roles.map((role) => (
          <div key={role.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">{role.name}</h4>
                  {role.isSystem && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">System</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{role.description}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onEditRole(role)}
                  className="p-1 text-gray-600 hover:text-blue-600"
                  disabled={role.isSystem}
                >
                  <Edit className="w-4 h-4" />
                </button>
                {!role.isSystem && (
                  <button 
                    onClick={() => onDeleteRole(role.id)}
                    className="p-1 text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {role.permissions.map((permission) => (
                <span
                  key={permission.id}
                  className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded"
                >
                  {permission.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleManagement;