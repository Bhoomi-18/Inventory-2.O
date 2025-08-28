import React, { useState } from 'react';
import { Shield, Plus, Edit, Trash2 } from 'lucide-react';
import { useRoles, type Permission, type UserRole } from '../../hooks/useRole';

interface RoleManagementProps {
  onClose?: () => void;
}

const SYSTEM_ROLES = [
  {
    _id: 'admin-system-id',
    name: 'Admin',
    description: 'Full access to all modules and settings.',
    permissions: [
      { id: '1', name: 'Asset Management', module: 'assets', actions: ['read', 'write', 'delete'] },
      { id: '2', name: 'User Management', module: 'users', actions: ['read', 'write'] },
      { id: '3', name: 'Reports', module: 'reports', actions: ['read', 'write'] },
      { id: '4', name: 'Settings', module: 'settings', actions: ['read'] },
      { id: '5', name: 'Invoices', module: 'invoices', actions: ['read', 'write', 'delete'] },
    ],
    isSystem: true,
  },
  {
    _id: 'manager-system-id',
    name: 'Manager',
    description: 'Manage users, assets, and reports.',
    permissions: [
      { id: '1', name: 'Asset Management', module: 'assets', actions: ['read', 'write'] },
      { id: '2', name: 'User Management', module: 'users', actions: ['read'] },
      { id: '3', name: 'Reports', module: 'reports', actions: ['read', 'write'] },
      { id: '5', name: 'Invoices', module: 'invoices', actions: ['read', 'write'] },
    ],
    isSystem: true,
  },
  {
    _id: 'employee-system-id',
    name: 'Employee',
    description: 'Limited access to assigned assets and reports.',
    permissions: [
      { id: '1', name: 'Asset Management', module: 'assets', actions: ['read'] },
      { id: '3', name: 'Reports', module: 'reports', actions: ['read'] },
      { id: '5', name: 'Invoices', module: 'invoices', actions: ['read'] },
    ],
    isSystem: true,
  },
];

const systemRoleNames = SYSTEM_ROLES.map(r => r.name);

const RoleManagement: React.FC<RoleManagementProps> = ({ onClose }) => {
  const { roles, loading, error, createRole, updateRole, deleteRole } = useRoles();
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  const [formRole, setFormRole] = useState({
    name: '',
    description: '',
    permissions: [] as Permission[]
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const availablePermissions: Permission[] = [
    { id: '1', name: 'Asset Management', module: 'assets', actions: ['read', 'write', 'delete'] },
    { id: '2', name: 'User Management', module: 'users', actions: ['read', 'write'] },
    { id: '3', name: 'Reports', module: 'reports', actions: ['read', 'write'] },
    { id: '4', name: 'Settings', module: 'settings', actions: ['read'] },
    { id: '5', name: 'Invoices', module: 'invoices', actions: ['read', 'write', 'delete'] },
  ];

  const isSystemRole = (role: UserRole) => systemRoleNames.includes(role.name) || role.isSystem;

  const openCreate = () => {
    setEditingRole(null);
    setFormRole({ name: '', description: '', permissions: [] });
    setShowForm(true);
  };

  const openEdit = (role: UserRole) => {
    if (isSystemRole(role)) return;
    setEditingRole(role);
    setFormRole({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setShowForm(true);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormRole(prev => ({ ...prev, [field]: value }));
  };

  const handlePermissionChange = (permission: Permission) => {
    setFormRole(prev => ({
      ...prev,
      permissions: prev.permissions.some(p => p.id === permission.id)
        ? prev.permissions.filter(p => p.id !== permission.id)
        : [...prev.permissions, permission]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      await updateRole(editingRole._id, formRole);
    } else {
      await createRole({ ...formRole, _id: '', isSystem: false });
    }
    setShowForm(false);
    setEditingRole(null);
    setFormRole({ name: '', description: '', permissions: [] });
  };

  const handleDelete = async () => {
    if (deleteId) {
      const role = roles.find(r => r._id === deleteId);
      if (role && isSystemRole(role)) return;
      await deleteRole(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Role Management</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCreate}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            Create Role
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Show predefined system roles first */}
      <div className="divide-y divide-gray-200">
        {SYSTEM_ROLES.map((role) => (
          <div key={role._id} className="p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{role.name}</h4>
                <p className="text-sm text-gray-600">{role.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-1 text-gray-400 cursor-not-allowed"
                  disabled
                  style={{ pointerEvents: 'none', opacity: 0.5 }}
                  title="System role cannot be edited"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-1 text-gray-400 cursor-not-allowed"
                  disabled
                  style={{ pointerEvents: 'none', opacity: 0.5 }}
                  title="System role cannot be deleted"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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

      {showForm && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                <input
                  type="text"
                  value={formRole.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  disabled={systemRoleNames.includes(formRole.name)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formRole.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
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
                      checked={formRole.permissions.some(p => p.id === permission.id)}
                      onChange={() => handlePermissionChange(permission)}
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
                disabled={systemRoleNames.includes(formRole.name)}
              >
                {editingRole ? 'Update Role' : 'Create Role'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingRole(null); }}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="p-4 text-gray-500">Loading roles...</div>
      ) : error ? (
        <div className="p-4 text-red-500">{error}</div>
      ) : (
        <div className="divide-y divide-gray-200">
          {roles
            .filter(role => !systemRoleNames.includes(role.name) && !role.isSystem)
            .map((role) => (
              <div key={role._id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{role.name}</h4>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-1 text-gray-600 hover:text-blue-600"
                      onClick={() => openEdit(role)}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(role._id)}
                      className="p-1 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
      )}

      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h4 className="text-lg font-semibold mb-2">Delete Role?</h4>
            <p className="mb-4 text-gray-700">Are you sure you want to delete this role?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
