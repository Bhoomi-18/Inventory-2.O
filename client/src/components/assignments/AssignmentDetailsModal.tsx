import React from 'react';
import { X, Package, User, Calendar, FileText } from 'lucide-react';
import type { Assignment } from '../../types/assignment';
import { formatDate, getStatusColor } from '../../utils/formatters';

interface AssignmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  onReturn?: (assignment: Assignment) => void;
  onEdit?: (assignment: Assignment) => void;
}

const AssignmentDetailsModal: React.FC<AssignmentDetailsModalProps> = ({
  isOpen,
  onClose,
  assignment,
  onReturn,
  onEdit
}) => {
  if (!isOpen || !assignment) return null;

  const canReturn = assignment.status === 'Active' || assignment.status === 'Overdue';
  const canEdit = assignment.status !== 'Returned';

  const assignmentDate = new Date(assignment.assignmentDate);
  const expectedReturnDate = new Date(assignment.expectedReturn);
  const today = new Date();
  
  const daysSinceAssignment = Math.floor((today.getTime() - assignmentDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilDue = Math.floor((expectedReturnDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Assignment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(assignment.status)}`}>
              {assignment.status}
            </span>
            {assignment.status === 'Overdue' && (
              <span className="text-red-600 text-sm font-medium">
                {Math.abs(daysUntilDue)} days overdue
              </span>
            )}
            {assignment.status === 'Active' && daysUntilDue <= 7 && (
              <span className="text-orange-600 text-sm font-medium">
                Due in {daysUntilDue} days
              </span>
            )}
          </div>

          {/* Asset Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Asset Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Asset Name</p>
                <p className="font-medium text-gray-900">{assignment.asset}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Asset ID</p>
                <p className="font-medium text-gray-900">{assignment.assetId}</p>
              </div>
            </div>
          </div>

          {/* Assignee Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              Assigned To
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                {assignment.assignedTo.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium text-gray-900">{assignment.assignedTo}</p>
                <p className="text-sm text-gray-500">{assignment.department}</p>
              </div>
            </div>
          </div>

          {/* Timeline Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Assignment Date:</span>
                <span className="font-medium text-gray-900">{formatDate(assignment.assignmentDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Expected Return:</span>
                <span className="font-medium text-gray-900">{formatDate(assignment.expectedReturn)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Days Since Assignment:</span>
                <span className="font-medium text-gray-900">{daysSinceAssignment} days</span>
              </div>
              {assignment.status === 'Returned' && assignment.actualReturn && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Actual Return:</span>
                  <span className="font-medium text-gray-900">{formatDate(assignment.actualReturn)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {assignment.notes && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">{assignment.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            {canEdit && onEdit && (
              <button
                onClick={() => onEdit(assignment)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Assignment
              </button>
            )}
            {canReturn && onReturn && (
              <button
                onClick={() => onReturn(assignment)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Return Asset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailsModal;