import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Office } from '../../types/office';

interface OfficeFormProps {
  initial?: Partial<Office>;
  onSubmit: (office: Partial<Office>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const OfficeForm: React.FC<OfficeFormProps> = ({ initial, onSubmit, onCancel, isOpen }) => {
  const [form, setForm] = useState<Partial<Office>>(initial || {});

  useEffect(() => {
    setForm(initial || {});
  }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      address: {
        street: form.address?.street ?? '',
        city: form.address?.city ?? '',
        state: form.address?.state ?? '',
        zipCode: form.address?.zipCode ?? '',
        country: form.address?.country ?? '',
        [e.target.name]: e.target.value
      }
    });
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      contactInfo: { 
        phone: form.contactInfo?.phone ?? '',
        email: form.contactInfo?.email ?? '',
        [e.target.name]: e.target.value 
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initial?.id ? 'Edit Office' : 'Add New Office'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Office Name *
              </label>
              <input
                name="name"
                value={form.name || ''}
                onChange={handleChange}
                placeholder="Enter office name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Office Code *
              </label>
              <input
                name="code"
                value={form.code || ''}
                onChange={handleChange}
                placeholder="Enter office code"
                required
                disabled={form.isMain}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  form.isMain ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />
              {form.isMain && (
                <p className="text-xs text-gray-500 mt-1">Main office code cannot be changed</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <div className="space-y-3">
              <input
                name="street"
                value={form.address?.street || ''}
                onChange={handleAddressChange}
                placeholder="Street Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  name="city"
                  value={form.address?.city || ''}
                  onChange={handleAddressChange}
                  placeholder="City"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  name="state"
                  value={form.address?.state || ''}
                  onChange={handleAddressChange}
                  placeholder="State/Province"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  name="zipCode"
                  value={form.address?.zipCode || ''}
                  onChange={handleAddressChange}
                  placeholder="ZIP/Postal Code"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  name="country"
                  value={form.address?.country || ''}
                  onChange={handleAddressChange}
                  placeholder="Country"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="phone"
                value={form.contactInfo?.phone || ''}
                onChange={handleContactChange}
                placeholder="Phone Number"
                type="tel"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                name="email"
                value={form.contactInfo?.email || ''}
                onChange={handleContactChange}
                placeholder="Email Address"
                type="email"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
              <input
                name="manager"
                value={form.manager || ''}
                onChange={handleChange}
                placeholder="Manager Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={form.status || 'Active'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {initial?.id ? 'Update Office' : 'Add Office'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfficeForm;