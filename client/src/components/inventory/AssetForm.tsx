import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import type { Asset } from '../../types/asset';

interface AssetFormProps {
  asset?: Asset | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface FormData {
  name: string;
  category: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: number;
  vendor: string;
  status: string;
  condition: string;
  location: string;
  assignedTo: string;
  notes: string;
}

const categories = [
  'Computers & Laptops',
  'Monitors & Displays',
  'Mobile Devices',
  'Network Equipment',
  'Office Equipment',
  'Other'
];

const statuses = ['Available', 'Assigned', 'Under Repair'];
const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

const AssetForm: React.FC<AssetFormProps> = ({ 
  asset, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    serialNumber: '',
    purchaseDate: '',
    purchasePrice: 0,
    vendor: '',
    status: 'Available',
    condition: 'Good',
    location: 'Main Office',
    assignedTo: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name || '',
        category: asset.category || '',
        serialNumber: asset.serialNumber || '',
        purchaseDate: asset.purchaseDate ? new Date(asset.purchaseDate).toISOString().split('T')[0] : '',
        purchasePrice: asset.purchasePrice || 0,
        vendor: asset.vendor || '',
        status: asset.status || 'Available',
        condition: asset.condition || 'Good',
        location: asset.location || 'Main Office',
        assignedTo: asset.assignedTo || '',
        notes: asset.notes || ''
      });
    }
  }, [asset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Asset name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required';
    }

    if (!formData.purchasePrice || formData.purchasePrice <= 0) {
      newErrors.purchasePrice = 'Purchase price must be greater than 0';
    }

    if (!formData.vendor.trim()) {
      newErrors.vendor = 'Vendor is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Asset Name */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asset Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter asset name"
            disabled={loading}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>

        {/* Serial Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Serial Number *
          </label>
          <input
            type="text"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.serialNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter serial number"
            disabled={loading}
          />
          {errors.serialNumber && <p className="text-red-500 text-xs mt-1">{errors.serialNumber}</p>}
        </div>

        {/* Purchase Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Date *
          </label>
          <input
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.purchaseDate ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.purchaseDate && <p className="text-red-500 text-xs mt-1">{errors.purchaseDate}</p>}
        </div>

        {/* Purchase Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Price *
          </label>
          <input
            type="number"
            name="purchasePrice"
            value={formData.purchasePrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.purchasePrice ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
            disabled={loading}
          />
          {errors.purchasePrice && <p className="text-red-500 text-xs mt-1">{errors.purchasePrice}</p>}
        </div>

        {/* Vendor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vendor *
          </label>
          <input
            type="text"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.vendor ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter vendor name"
            disabled={loading}
          />
          {errors.vendor && <p className="text-red-500 text-xs mt-1">{errors.vendor}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condition
          </label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {conditions.map(condition => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter location"
            disabled={loading}
          />
        </div>

        {/* Assigned To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assigned To
          </label>
          <input
            type="text"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter assignee name"
            disabled={loading}
          />
        </div>

        {/* Notes */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Additional notes about the asset"
            disabled={loading}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <X className="w-4 h-4 inline mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : asset ? 'Update Asset' : 'Create Asset'}
        </button>
      </div>
    </form>
  );
};

export default AssetForm;