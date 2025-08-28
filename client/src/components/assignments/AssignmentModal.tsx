import React, { useState, useEffect } from 'react';
import { X, Package, User, Calendar } from 'lucide-react';
import type { CreateAssignmentData } from '../../services/assignmentService';
import assetService from '../../services/assetService';
import userService from '../../services/userService';

interface Asset {
  _id: string;
  name: string;
  assetId: string;
  category: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  department: string;
}

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAssignmentData) => Promise<void>;
  loading?: boolean;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading = false 
}) => {
  const [formData, setFormData] = useState<CreateAssignmentData>({
    assetId: '',
    userId: '',
    expectedReturn: '',
    notes: ''
  });
  const [assets, setAssets] = useState<Asset[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setFormData({
        assetId: '',
        userId: '',
        expectedReturn: '',
        notes: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [assetsData, usersData] = await Promise.all([
        assetService.getAssetsForSelection(),
        userService.getUsersForSelection()
      ]);

      setAssets(assetsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    
    if (!formData.assetId) {
      newErrors.assetId = 'Please select an asset';
    }
    
    if (!formData.userId) {
      newErrors.userId = 'Please select a user';
    }
    
    if (!formData.expectedReturn) {
      newErrors.expectedReturn = 'Please select expected return date';
    } else {
      const returnDate = new Date(formData.expectedReturn);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (returnDate <= today) {
        newErrors.expectedReturn = 'Expected return date must be in the future';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message });
    }
  };

  const handleChange = (field: keyof CreateAssignmentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">New Assignment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Asset Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="w-4 h-4 inline mr-2" />
              Select Asset
            </label>
            <select
              value={formData.assetId}
              onChange={(e) => handleChange('assetId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.assetId ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={loadingData || loading}
            >
              <option value="">Choose an asset...</option>
              {assets.map(asset => (
                <option key={asset._id} value={asset._id}>
                  {asset.name} ({asset.assetId}) - {asset.category}
                </option>
              ))}
            </select>
            {errors.assetId && (
              <p className="mt-1 text-sm text-red-600">{errors.assetId}</p>
            )}
          </div>

          {/* User Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Assign To
            </label>
            <select
              value={formData.userId}
              onChange={(e) => handleChange('userId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.userId ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={loadingData || loading}
            >
              <option value="">Choose a user...</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email}) - {user.department}
                </option>
              ))}
            </select>
            {errors.userId && (
              <p className="mt-1 text-sm text-red-600">{errors.userId}</p>
            )}
          </div>

          {/* Expected Return Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Expected Return Date
            </label>
            <input
              type="date"
              value={formData.expectedReturn}
              onChange={(e) => handleChange('expectedReturn', e.target.value)}
              min={minDate}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.expectedReturn ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.expectedReturn && (
              <p className="mt-1 text-sm text-red-600">{errors.expectedReturn}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Add any additional notes about this assignment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500">
              {(formData.notes || '').length}/500 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading || loadingData}
            >
              {loading ? 'Creating Assignment...' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentModal;