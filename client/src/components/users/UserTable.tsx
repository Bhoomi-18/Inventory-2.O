import React from 'react';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';
import type { User as UserType } from '../../types';
import { getInitials, getStatusColor } from '../../utils';

interface UserTableProps {
  users: UserType[];
  onViewUser: (user: UserType) => void;
  onEditUser: (user: UserType) => void;
  onDeactivateUser: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onViewUser, onEditUser, onDeactivateUser }) => (
  <div className="bg-white rounded-lg border border-gray-200">
    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search users..."
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Roles</option>
          <option>Admin</option>
          <option>Manager</option>
          <option>Employee</option>
        </select>
        <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Pending</option>
        </select>
      </div>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4 text-sm font-medium text-gray-900">USER</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">DEPARTMENT</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">ROLE</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">OFFICE</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">ASSETS</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">STATUS</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
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
                      {user.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.department}</p>
                  <p className="text-xs text-gray-500">{user.position}</p>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-900">{user.role.name}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{user.office}</span>
                </div>
              </td>
              <td className="p-4">
                <span className="text-sm font-medium text-gray-900">{user.assignedAssets}</span>
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button 
                    onClick={() => onViewUser(user)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => onEditUser(user)}
                    className="text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Edit
                  </button>
                  {user.status === 'Active' && (
                    <button 
                      onClick={() => onDeactivateUser(user.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Deactivate
                    </button>
                  )}
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