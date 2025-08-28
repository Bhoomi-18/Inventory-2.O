import React from 'react';
import { Package, Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';
import type { RepairTicket } from '../../types/repair';

interface RepairTableProps {
  repairs: RepairTicket[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  selectedRepairs: string[];
  onSelectionChange: (selected: string[]) => void;
  onViewRepair: (repair: RepairTicket) => void;
  onUpdateStatus: (repair: RepairTicket) => void;
  onDeleteRepair: (id: string) => void;
  onPageChange: (page: number) => void;
}

const RepairTable: React.FC<RepairTableProps> = ({
  repairs,
  loading,
  pagination,
  selectedRepairs,
  onSelectionChange,
  onViewRepair,
  onUpdateStatus,
  onDeleteRepair,
  onPageChange
}) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(repairs.map(repair => repair.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRepair = (repairId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedRepairs, repairId]);
    } else {
      onSelectionChange(selectedRepairs.filter(id => id !== repairId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-orange-100 text-orange-800';
      case 'Complete':
        return 'bg-green-100 text-green-800';
      case 'Awaiting Parts':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'High':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading repairs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Active Repair Tickets</h3>
          {pagination && (
            <span className="text-sm text-gray-500">
              Showing {repairs.length} of {pagination.total} repairs
            </span>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">
                <input
                  type="checkbox"
                  checked={repairs.length > 0 && selectedRepairs.length === repairs.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">ASSET</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">ISSUE</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">VENDOR</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">STATUS</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">PRIORITY</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">COST</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">DATE CREATED</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {repairs.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-500">
                  No repair tickets found
                </td>
              </tr>
            ) : (
              repairs.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedRepairs.includes(ticket.id)}
                      onChange={(e) => handleSelectRepair(ticket.id, e.target.checked)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Package className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{ticket.asset || ticket.assetName}</p>
                        <p className="text-sm text-gray-500">{ticket.assetId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900">{ticket.issue}</p>
                      {ticket.description && (
                        <p className="text-sm text-gray-500 truncate max-w-xs" title={ticket.description}>
                          {ticket.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-900">{ticket.vendor}</span>
                    {ticket.assignedTechnician && (
                      <p className="text-xs text-gray-500">Tech: {ticket.assignedTechnician}</p>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(ticket.priority)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(ticket.cost)}
                      </span>
                      {ticket.estimatedCost && ticket.estimatedCost !== ticket.cost && (
                        <p className="text-xs text-gray-500">
                          Est: {formatCurrency(ticket.estimatedCost)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-500">
                      {formatDate(ticket.dateCreated)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => onViewRepair(ticket)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onUpdateStatus(ticket)}
                        className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors"
                        title="Update Status"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {ticket.status !== 'Complete' && (
                        <button
                          onClick={() => onDeleteRepair(ticket.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete Repair"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
      {pagination && pagination.pages > 1 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const page = Math.max(1, pagination.page - 2) + i;
                if (page > pagination.pages) return null;
                
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 text-sm border rounded ${
                      page === pagination.page
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairTable;