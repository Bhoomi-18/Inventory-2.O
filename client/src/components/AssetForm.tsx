// client/src/components/AssetForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth, apiCall, type Asset } from '../App';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

const AssetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    assetTag: '',
    name: '',
    category: 'laptop',
    brand: '',
    model: '', // Keep as 'model' for form, will map to 'modelName' when sending
    serialNumber: '',
    purchaseDate: '',
    purchasePrice: 0,
    warrantyExpiration: '',
    location: '',
    specifications: {
      processor: '',
      ram: '',
      storage: '',
      os: '',
      other: ''
    },
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      fetchAsset(id);
    }
  }, [id, isEdit]);

  const fetchAsset = async (assetId: string) => {
    try {
      setLoading(true);
      const asset: Asset = await apiCall(`/inventory/${assetId}`);
      
      setFormData({
        assetTag: asset.assetTag,
        name: asset.name,
        category: asset.category,
        brand: asset.brand,
        model: asset.modelName, // Map 'modelName' back to 'model' for form
        serialNumber: asset.serialNumber,
        purchaseDate: asset.purchaseDate.split('T')[0], // Format date for input
        purchasePrice: asset.purchasePrice,
        warrantyExpiration: asset.warrantyExpiration ? asset.warrantyExpiration.split('T')[0] : '',
        location: asset.location,
        specifications: {
          processor: asset.specifications?.processor || '',
          ram: asset.specifications?.ram || '',
          storage: asset.specifications?.storage || '',
          os: asset.specifications?.os || '',
          other: asset.specifications?.other || ''
        },
        notes: asset.notes || ''
      });
    } catch (error) {
      console.error('Failed to fetch asset:', error);
      setError('Failed to load asset details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('specifications.')) {
      const specField = name.split('.')[1];
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [specField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'purchasePrice' ? parseFloat(value) || 0 : value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      const method = isEdit ? 'PUT' : 'POST';
      const endpoint = isEdit ? `/inventory/${id}` : '/inventory';
      
      // Clean up specifications - remove empty strings
      const cleanedSpecifications = Object.fromEntries(
        Object.entries(formData.specifications).filter(([_, value]) => value.trim() !== '')
      );

      const submitData = {
        ...formData,
        specifications: Object.keys(cleanedSpecifications).length > 0 ? cleanedSpecifications : undefined
      };
      
      await apiCall(endpoint, {
        method,
        body: JSON.stringify(submitData)
      });

      navigate('/inventory');
    } catch (err: any) {
      setError(err.message || 'Failed to save asset');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/inventory')}
          className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Asset' : 'Add New Asset'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {isEdit ? 'Update asset information' : 'Register a new asset in the inventory'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Asset Tag *
                </label>
                <input
                  type="text"
                  name="assetTag"
                  required
                  value={formData.assetTag}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Asset Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="laptop">Laptop</option>
                  <option value="desktop">Desktop</option>
                  <option value="monitor">Monitor</option>
                  <option value="mobile">Mobile</option>
                  <option value="tablet">Tablet</option>
                  <option value="printer">Printer</option>
                  <option value="router">Router</option>
                  <option value="switch">Switch</option>
                  <option value="server">Server</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Model *
                </label>
                <input
                  type="text"
                  name="model"
                  required
                  value={formData.model}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Serial Number *
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  required
                  value={formData.serialNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  required
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Purchase Price *
                </label>
                <input
                  type="number"
                  name="purchasePrice"
                  required
                  min="0"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Warranty Expiration
                </label>
                <input
                  type="date"
                  name="warrantyExpiration"
                  value={formData.warrantyExpiration}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Office Floor 2, Room 201"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Technical Specifications
            </h3>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Processor
                </label>
                <input
                  type="text"
                  name="specifications.processor"
                  value={formData.specifications.processor}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  RAM
                </label>
                <input
                  type="text"
                  name="specifications.ram"
                  value={formData.specifications.ram}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Storage
                </label>
                <input
                  type="text"
                  name="specifications.storage"
                  value={formData.specifications.storage}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Operating System
                </label>
                <input
                  type="text"
                  name="specifications.os"
                  value={formData.specifications.os}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Other Specifications
                </label>
                <textarea
                  name="specifications.other"
                  rows={3}
                  value={formData.specifications.other}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Additional Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional notes about this asset..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/inventory')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {submitLoading ? 'Saving...' : isEdit ? 'Update Asset' : 'Create Asset'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssetForm;