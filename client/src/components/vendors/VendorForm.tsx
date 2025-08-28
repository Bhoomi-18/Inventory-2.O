import React, { useState, useEffect } from 'react';
import { X, Save, Loader } from 'lucide-react';
import type { Vendor } from '../../types/vendor';
import type { CreateVendorData, UpdateVendorData } from '../../services/vendorService';

interface VendorFormProps {
  vendor?: Vendor;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVendorData | UpdateVendorData) => Promise<boolean>;
  isLoading?: boolean;
}

const VendorForm: React.FC<VendorFormProps> = ({
  vendor,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
    status: 'Active' as 'Active' | 'Review' | 'Inactive'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || '',
        description: vendor.description || '',
        email: vendor.email || '',
        phone: vendor.phone || '',
        address: vendor.address || '',
        contactPerson: vendor.contactPerson || '',
        status: vendor.status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        email: '',
        phone: '',
        address: '',
        contactPerson: '',
        status: 'Active'
      });
    }
    setErrors({});
  }, [vendor, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vendor name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    if (formData.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && (formData.phone.length < 10 || formData.phone.length > 20)) {
      newErrors.phone = 'Phone number must be between 10 and 20 characters';
    }

    if (formData.address && (formData.address.length < 5 || formData.address.length > 500)) {
      newErrors.address = 'Address must be between 5 and 500 characters';
    }

    if (formData.contactPerson && (formData.contactPerson.length < 2 || formData.contactPerson.length > 100)) {
      newErrors.contactPerson = 'Contact person name must be between 2 and 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      status: formData.status,
      ...(formData.email.trim() && { email: formData.email.trim() }),
      ...(formData.phone.trim() && { phone: formData.phone.trim() }),
      ...(formData.address.trim() && { address: formData.address.trim() }),
      ...(formData.contactPerson.trim() && { contactPerson: formData.contactPerson.trim() })
    };

    const success = await onSubmit(submitData);
    if (success) {
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {vendor ? 'Edit Vendor' : 'Add New Vendor'}
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-50 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter vendor name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isLoading}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50 disabled:bg-gray-50 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter vendor description (minimum 10 characters)"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-50"
              >
                <option value="Active">Active</option>
                <option value="Review">Review</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-50 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="vendor@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-50 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+1 234 567 8900"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
            </div>

            {/* Contact Person */}
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person
              </label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-50 ${
                  errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {errors.contactPerson && <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={isLoading}
                rows={2}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50 disabled:bg-gray-50 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="123 Main St, City, State 12345"
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {vendor ? 'Update Vendor' : 'Create Vendor'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorForm;