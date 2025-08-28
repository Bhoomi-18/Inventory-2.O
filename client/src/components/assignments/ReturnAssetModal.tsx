import React, { useState } from 'react';
import { X, Package, User, Calendar, FileText } from 'lucide-react';
import type { Assignment } from '../../types/assignment';
import { formatDate } from '../../utils/formatters';

interface ReturnAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => Promise<void>;
  assignment: Assignment | null;
  loading?: boolean;
}

const ReturnAssetModal: React.FC<ReturnAssetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  assignment,
  loading = false
}) => {
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await onConfirm(notes.trim() || undefined);
      setNotes('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to return asset');
    }
  };

  const handleClose = () => {
    if (!loading) {
      setNotes('');
      setError('');
      onClose();
    }
  };

  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Return Asset</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Assignment Details */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{assignment.asset}</p>
                <p className="text-sm text-gray-500">{assignment.assetId}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{assignment.assignedTo}</p>
                <p className="text-sm text-gray-500">{assignment.department}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">
                  Expected Return: {formatDate(assignment.expectedReturn)}
                </p>
                <p className="text-sm text-gray-500">
                  Assigned: {formatDate(assignment.assignmentDate)}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Return Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Return Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Add any notes about the asset condition or return..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                {notes.length}/500 characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Returning...' : 'Return Asset'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReturnAssetModal;