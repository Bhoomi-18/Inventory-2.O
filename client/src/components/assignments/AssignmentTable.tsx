import React from 'react';
import { Package } from 'lucide-react';
import type { Assignment } from '../../types';

interface AssignmentTableProps {
  assignments: Assignment[];
}

const AssignmentTable: React.FC<AssignmentTableProps> = ({ assignments }) => (
  <div className="bg-white rounded-lg border border-gray-200">
    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Assignment History</h3>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search assignments..."
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>Active</option>
          <option>Overdue</option>
          <option>Returned</option>
        </select>
      </div>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4 text-sm font-medium text-gray-900">ASSET</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">ASSIGNED TO</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">ASSIGNMENT DATE</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">EXPECTED RETURN</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">STATUS</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {assignments.map((assignment) => (
            <tr key={assignment.id} className="hover:bg-gray-50">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{assignment.asset}</p>
                    <p className="text-sm text-gray-500">{assignment.assetId}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {assignment.assignedTo.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{assignment.assignedTo}</p>
                    <p className="text-xs text-gray-500">{assignment.department}</p>
                  </div>
                </div>
              </td>
              <td className="p-4 text-sm text-gray-900">{assignment.assignmentDate}</td>
              <td className="p-4 text-sm text-gray-900">{assignment.expectedReturn}</td>
              <td className="p-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  assignment.status === 'Active' 
                    ? 'bg-green-100 text-green-800'
                    : assignment.status === 'Overdue'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {assignment.status}
                </span>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">View Details</button>
                  <button className="text-orange-600 hover:text-orange-800 text-sm">Return Item</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AssignmentTable;