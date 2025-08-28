import React, { useState } from 'react';
import { Package, ChevronLeft, ChevronRight, MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { Assignment } from '../../types/assignment';
import { formatDate, getStatusColor, getInitials } from '../../utils/formatters';
import type { AssignmentFilters } from '../../services/assignmentService';

interface AssignmentTableProps {
  assignments: Assignment[];
  loading?: boolean;
  filters: AssignmentFilters;
  onFiltersChange: (filters: AssignmentFilters) => void;
  pagination: {
    current: number;
    total: number;
    count: number;
    totalRecords: number;
  };
  onViewDetails: (assignment: Assignment) => void;
  onReturnAsset: (assignment: Assignment) => void;
  onEditAssignment?: (assignment: Assignment) => void;
  onDeleteAssignment?: (assignment: Assignment) => void;
}

const AssignmentTable: React.FC<AssignmentTableProps> = ({ 
  assignments,
  loading = false,
  filters,
  onFiltersChange,
  pagination,
  onViewDetails,
  onReturnAsset,
  onEditAssignment,
  onDeleteAssignment
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search, page: 1 });
  };

  const handleStatusFilter = (status: string) => {
    onFiltersChange({ ...filters, status, page: 1 });
  };

  const handlePageChange = (page: number) => {
    onFiltersChange({ ...filters, page });
  };

  const handleSortChange = (sort: string) => {
    onFiltersChange({ ...filters, sort });
  };

  const toggleDropdown = (assignmentId: string) => {
    setDropdownOpen(dropdownOpen === assignmentId ? null : assignmentId);
  };

  const canReturn = (assignment: Assignment) => {
    return assignment.status === 'Active' || assignment.status === 'Overdue';
  };

  const canEdit = (assignment: Assignment) => {
    return assignment.status !== 'Returned';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="p-8">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Assignment History</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search assignments..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select 
            value={filters.status || ''}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Overdue">Overdue</option>
            <option value="Returned">Returned</option>
          </select>
          <select 
            value={filters.sort || '-createdAt'}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="-assignmentDate">Assignment Date (Recent)</option>
            <option value="assignmentDate">Assignment Date (Old)</option>
            <option value="-expectedReturn">Return Date (Recent)</option>
            <option value="expectedReturn">Return Date (Old)</option>
            <option value="asset.name">Asset Name (A-Z)</option>
            <option value="-asset.name">Asset Name (Z-A)</option>
            <option value="assignedTo.name">Assignee (A-Z)</option>
            <option value="-assignedTo.name">Assignee (Z-A)</option>
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
            {assignments.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No assignments found. Try adjusting your filters or create a new assignment.
                </td>
              </tr>
            ) : (
              assignments.map((assignment) => (
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
                        {getInitials(assignment.assignedTo)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{assignment.assignedTo}</p>
                        <p className="text-xs text-gray-500">{assignment.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-900">{formatDate(assignment.assignmentDate)}</td>
                  <td className="p-4 text-sm text-gray-900">{formatDate(assignment.expectedReturn)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onViewDetails(assignment)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                      {canReturn(assignment) && (
                        <button 
                          onClick={() => onReturnAsset(assignment)}
                          className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                        >
                          Return Item
                        </button>
                      )}
                      
                      {/* More actions dropdown */}
                      {(onEditAssignment || onDeleteAssignment) && (
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(assignment.id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {dropdownOpen === assignment.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                              <div className="py-1">
                                {onEditAssignment && canEdit(assignment) && (
                                  <button
                                    onClick={() => {
                                      onEditAssignment(assignment);
                                      setDropdownOpen(null);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit Assignment
                                  </button>
                                )}
                                {onDeleteAssignment && (
                                  <button
                                    onClick={() => {
                                      onDeleteAssignment(assignment);
                                      setDropdownOpen(null);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Assignment
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination.total > 1 && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {((pagination.current - 1) * (filters.limit || 20)) + 1} to{' '}
            {Math.min(pagination.current * (filters.limit || 20), pagination.totalRecords)} of{' '}
            {pagination.totalRecords} assignments
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.total) }, (_, i) => {
                let pageNum;
                if (pagination.total <= 5) {
                  pageNum = i + 1;
                } else if (pagination.current <= 3) {
                  pageNum = i + 1;
                } else if (pagination.current >= pagination.total - 2) {
                  pageNum = pagination.total - 4 + i;
                } else {
                  pageNum = pagination.current - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 text-sm rounded ${
                      pageNum === pagination.current
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.current + 1)}
              disabled={pagination.current === pagination.total}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentTable;