import React from 'react';
import { Mail, Shield } from 'lucide-react';
import type { User as UserType } from '../../types/user';
import { getInitials, getStatusColor } from '../../utils';

interface UserTableProps {
  users: UserType[];
  onViewUser: (user: UserType) => void;
  onEditUser: (user: UserType) => void;
  onDeactivateUser: (userId: string) => void;
}

const isAdminUser = (user: UserType) =>
  typeof user.role === 'string'
    ? user.role === 'Admin'
    : user.role?.name === 'Admin';

const UserTable: React.FC<UserTableProps> = ({
  users = [],
  onViewUser,
  onEditUser,
  onDeactivateUser
}) => (
  <div className="bg-white rounded-lg border border-gray-200">
    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search users..."
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4 text-sm font-medium text-gray-900">USER</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">ROLE</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">OFFICE</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">ASSETS</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">STATUS</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {(users ?? []).map((user) => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-900">
                    {typeof user.role === "string" ? user.role : user.role?.name}
                  </span>
                </div>
              </td>
              <td className="p-4">
                <span className="text-sm text-gray-900">{user.office || '-'}</span>
              </td>
              <td className="p-4">
                <span className="text-sm font-medium text-gray-900">{user.assignedAssets ?? 0}</span>
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status || 'Active')}`}>
                  {user.status || 'Active'}
                </span>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button 
                    onClick={() => onViewUser(user)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    disabled={isAdminUser(user)}
                    style={isAdminUser(user) ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                  >
                    View
                  </button>
                  <button 
                    onClick={() => onEditUser(user)}
                    className="text-gray-600 hover:text-gray-800 text-sm"
                    disabled={isAdminUser(user)}
                    style={isAdminUser(user) ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDeactivateUser(user._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                    disabled={isAdminUser(user)}
                    style={isAdminUser(user) ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default UserTable;
