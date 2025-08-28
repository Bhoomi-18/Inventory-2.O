import React from 'react';
import { X, Package, Clock, DollarSign, User, Calendar, AlertTriangle } from 'lucide-react';
import type { RepairTicket } from '../../types/repair';

interface ViewRepairModalProps {
  isOpen: boolean;
  onClose: () => void;
  repair: RepairTicket;
}

const ViewRepairModal: React.FC<ViewRepairModalProps> = ({
  isOpen,
  onClose,
  repair
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
      case 'High':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Repair Ticket Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-gray-600" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {repair.asset || repair.assetName}
                  </h3>
                  <p className="text-gray-600">ID: {repair.assetId}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(repair.status)}`}>
                  {repair.status}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(repair.priority)} flex items-center gap-1`}>
                  {getPriorityIcon(repair.priority)}
                  {repair.priority}
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <h4 className="font-medium text-gray-900 mb-1">{repair.issue}</h4>
              {repair.description && (
                <p className="text-gray-600">{repair.description}</p>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Repair Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Vendor</p>
                      <p className="text-sm text-gray-600">{repair.vendor}</p>
                    </div>
                  </div>
                  
                  {repair.assignedTechnician && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Technician</p>
                        <p className="text-sm text-gray-600">{repair.assignedTechnician}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Created</p>
                      <p className="text-sm text-gray-600">{formatDate(repair.dateCreated)}</p>
                    </div>
                  </div>
                  
                  {repair.dateStarted && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Started</p>
                        <p className="text-sm text-gray-600">{formatDate(repair.dateStarted)}</p>
                      </div>
                    </div>
                  )}
                  
                  {repair.estimatedCompletion && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Est. Completion</p>
                        <p className="text-sm text-gray-600">{formatDate(repair.estimatedCompletion)}</p>
                      </div>
                    </div>
                  )}
                  
                  {repair.dateCompleted && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Completed</p>
                        <p className="text-sm text-gray-600">{formatDate(repair.dateCompleted)}</p>
                      </div>
                    </div>
                  )}
                  
                  {repair.duration && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Duration</p>
                        <p className="text-sm text-gray-600">
                          {repair.duration} {repair.duration === 1 ? 'day' : 'days'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Cost Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Current Cost</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(repair.cost)}</p>
                    </div>
                  </div>
                  
                  {repair.estimatedCost && repair.estimatedCost !== repair.cost && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Estimated Cost</p>
                        <p className="text-sm text-gray-600">{formatCurrency(repair.estimatedCost)}</p>
                        {repair.cost > repair.estimatedCost && (
                          <p className="text-xs text-red-600">Over budget by {formatCurrency(repair.cost - repair.estimatedCost)}</p>
                        )}
                        {repair.cost < repair.estimatedCost && (
                          <p className="text-xs text-green-600">Under budget by {formatCurrency(repair.estimatedCost - repair.cost)}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {repair.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{repair.notes}</p>
                  </div>
                </div>
              )}

              {/* Status History could go here */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                    View asset details
                  </button>
                  <button className="w-full text-left text-sm text-green-600 hover:text-green-800 hover:bg-green-50 px-3 py-2 rounded transition-colors">
                    Contact vendor
                  </button>
                  <button className="w-full text-left text-sm text-orange-600 hover:text-orange-800 hover:bg-orange-50 px-3 py-2 rounded transition-colors">
                    Print repair ticket
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRepairModal;