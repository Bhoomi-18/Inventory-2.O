import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { RepairTicket, RepairRequest } from '../../types/repair';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  repair: RepairTicket;
  onSuccess: () => void;
  updateRepair: (id: string, data: Partial<RepairRequest>) => Promise<RepairTicket>;
  completeRepair: (id: string, data: { cost?: number; notes?: string }) => Promise<RepairTicket>;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  isOpen,
  onClose,
  repair,
  onSuccess,
  updateRepair,
  completeRepair
}) => {
  const [formData, setFormData] = useState({
    status: repair.status,
    priority: repair.priority,
    cost: repair.cost,
    estimatedCost: repair.estimatedCost || 0,
    assignedTechnician: repair.assignedTechnician || '',
    notes: repair.notes || '',
    estimatedCompletion: repair.estimatedCompletion ? repair.estimatedCompletion.split('T')[0] : ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        status: repair.status,
        priority: repair.priority,
        cost: repair.cost,
        estimatedCost: repair.estimatedCost || 0,
        assignedTechnician: repair.assignedTechnician || '',
        notes: repair.notes || '',
        estimatedCompletion: repair.estimatedCompletion ? repair.estimatedCompletion.split('T')[0] : ''
      });
      setErrors({});
    }
  }, [isOpen, repair]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost' || name === 'estimatedCost' ? Number(value) || 0 : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.cost < 0) {
      newErrors.cost = 'Cost cannot be negative';
    }
    if (formData.estimatedCost < 0) {
      newErrors.estimatedCost = 'Estimated cost cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const updateData: any = {
        status: formData.status,
        priority: formData.priority,
        estimatedCost: formData.estimatedCost,
        assignedTechnician: formData.assignedTechnician || undefined,
        notes: formData.notes || undefined,
        estimatedCompletion: formData.estimatedCompletion || undefined
      };

      if (formData.status === 'Complete' && repair.status !== 'Complete') {
        await completeRepair(repair.id, {
          cost: formData.cost,
          notes: formData.notes || undefined
        });
      } else {
        updateData.cost = formData.cost;
        await updateRepair(repair.id, updateData);
      }

      onSuccess();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to update repair ticket' });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRepair = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await completeRepair(repair.id, {
        cost: formData.cost,
        notes: formData.notes || undefined
      });
      onSuccess();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to complete repair' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Update Repair Status</h2>
              <p className="text-gray-600">{repair.asset || repair.assetName} ({repair.assetId})</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Current Issue Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Issue: {repair.issue}</h3>
            {repair.description && (
              <p className="text-gray-600 text-sm">{repair.description}</p>
            )}
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="In Progress">In Progress</option>
                <option value="Awaiting Parts">Awaiting Parts</option>
                <option value="Complete">Complete</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Cost Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Cost
              </label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.cost ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.cost && <p className="mt-1 text-sm text-red-600">{errors.cost}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Cost
              </label>
              <input
                type="number"
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.estimatedCost ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.estimatedCost && <p className="mt-1 text-sm text-red-600">{errors.estimatedCost}</p>}
            </div>
          </div>

          {/* Cost Comparison */}
          {formData.cost !== formData.estimatedCost && formData.estimatedCost > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-800 font-medium">Cost vs Estimate:</span>
                <div className="text-blue-700">
                  {formData.cost > formData.estimatedCost ? (
                    <span className="text-red-600">
                      Over by {formatCurrency(formData.cost - formData.estimatedCost)}
                    </span>
                  ) : (
                    <span className="text-green-600">
                      Under by {formatCurrency(formData.estimatedCost - formData.cost)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Technician and Completion Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Technician
              </label>
              <input
                type="text"
                name="assignedTechnician"
                value={formData.assignedTechnician}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Technician name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Completion
              </label>
              <input
                type="date"
                name="estimatedCompletion"
                value={formData.estimatedCompletion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Update notes, progress, or additional information..."
            />
          </div>

          {/* Status Change Info */}
          {formData.status !== repair.status && (
            <div className={`border rounded-lg p-4 ${
              formData.status === 'Complete' ? 'bg-green-50 border-green-200' :
              formData.status === 'Cancelled' ? 'bg-red-50 border-red-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <p className={`text-sm font-medium ${
                formData.status === 'Complete' ? 'text-green-800' :
                formData.status === 'Cancelled' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {formData.status === 'Complete' && 'This will mark the repair as completed and set the completion date.'}
                {formData.status === 'Cancelled' && 'This will cancel the repair ticket.'}
                {formData.status === 'Awaiting Parts' && 'This will mark the repair as waiting for parts.'}
                {formData.status === 'In Progress' && repair.status !== 'In Progress' && 'This will resume the repair work.'}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            {repair.status !== 'Complete' && formData.status !== 'Complete' && (
              <button
                type="button"
                onClick={handleCompleteRepair}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Completing...' : 'Mark Complete'}
              </button>
            )}
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Updating...' : 'Update Repair'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;