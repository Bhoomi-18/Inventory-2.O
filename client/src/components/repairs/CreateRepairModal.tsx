import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { RepairRequest, RepairTicket } from '../../types/repair';

interface CreateRepairModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  createRepair: (data: RepairRequest) => Promise<RepairTicket>;
}

const vendors = [
  { id: '1', name: 'TechFix Solutions' },
  { id: '2', name: 'Repair Masters Inc' },
  { id: '3', name: 'QuickFix IT' },
  { id: '4', name: 'Hardware Heroes' }
];

const priorities = ['Low', 'Medium', 'High'];

const initialForm: RepairRequest = {
  assetId: '',
  assetName: '',
  issue: '',
  description: '',
  vendor: '',
  vendorId: '',
  priority: 'Medium',
  estimatedCost: undefined,
  estimatedCompletion: '',
  assignedTechnician: '',
  notes: ''
};

const CreateRepairModal: React.FC<CreateRepairModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  createRepair
}) => {
  const [formData, setFormData] = useState<RepairRequest>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialForm);
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? undefined : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'vendorId') {
      const selectedVendor = vendors.find(v => v.id === value);
      if (selectedVendor) {
        setFormData(prev => ({
          ...prev,
          vendor: selectedVendor.name,
          vendorId: value
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.assetId.trim()) newErrors.assetId = 'Asset ID is required';
    if (!formData.assetName.trim()) newErrors.assetName = 'Asset name is required';
    if (!formData.issue.trim()) newErrors.issue = 'Issue description is required';
    else if (formData.issue.length < 5) newErrors.issue = 'Issue description must be at least 5 characters';
    if (!formData.vendorId) newErrors.vendorId = 'Vendor is required';
    if (formData.estimatedCost && formData.estimatedCost < 0) newErrors.estimatedCost = 'Estimated cost cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const submitData: RepairRequest = {
        ...formData,
        estimatedCost: formData.estimatedCost ? Number(formData.estimatedCost) : undefined
      };
      await createRepair(submitData);
      onSuccess();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create repair ticket' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Report New Issue</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Asset Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset ID *
              </label>
              <input
                type="text"
                name="assetId"
                value={formData.assetId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.assetId ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., LP001"
              />
              {errors.assetId && <p className="mt-1 text-sm text-red-600">{errors.assetId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset Name *
              </label>
              <input
                type="text"
                name="assetName"
                value={formData.assetName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.assetName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Dell Laptop"
              />
              {errors.assetName && <p className="mt-1 text-sm text-red-600">{errors.assetName}</p>}
            </div>
          </div>

          {/* Issue Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Description *
            </label>
            <input
              type="text"
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.issue ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Brief description of the problem"
            />
            {errors.issue && <p className="mt-1 text-sm text-red-600">{errors.issue}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Additional details about the issue..."
            />
          </div>

          {/* Vendor and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repair Vendor *
              </label>
              <select
                name="vendorId"
                value={formData.vendorId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.vendorId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select vendor</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
              {errors.vendorId && <p className="mt-1 text-sm text-red-600">{errors.vendorId}</p>}
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
                {priorities.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cost and Completion */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Cost
              </label>
              <input
                type="number"
                name="estimatedCost"
                value={formData.estimatedCost || ''}
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

          {/* Technician and Notes */}
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
              placeholder="Technician name (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Any additional information..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Repair Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRepairModal;
