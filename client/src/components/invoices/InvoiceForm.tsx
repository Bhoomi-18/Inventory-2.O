import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Invoice } from '../../types/invoice';
import type { CreateInvoiceRequest } from '../../services/invoiceService';

interface InvoiceFormProps {
  invoice?: Invoice | null;
  onSubmit: (data: CreateInvoiceRequest) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  assetId?: string;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  onSubmit,
  onClose,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    vendor: '',
    vendorId: '',
    amount: 0,
    taxAmount: 0,
    totalAmount: 0,
    issueDate: '',
    dueDate: '',
    description: '',
    items: [
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
        assetId: ''
      }
    ] as InvoiceItem[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (invoice) {
      setFormData({
        vendor: invoice.vendor,
        vendorId: invoice.vendorId,
        amount: invoice.amount,
        taxAmount: invoice.taxAmount,
        totalAmount: invoice.totalAmount,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        description: invoice.description,
        items: invoice.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          assetId: item.assetId || ''
        }))
      });
    }
  }, [invoice]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice;
    }

    setFormData(prev => ({ ...prev, items: newItems }));
    calculateTotals(newItems);
  };

  const calculateTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = formData.taxAmount;
    const totalAmount = subtotal + taxAmount;

    setFormData(prev => ({
      ...prev,
      amount: subtotal,
      totalAmount
    }));
  };

  const handleTaxChange = (taxAmount: number) => {
    const totalAmount = formData.amount + taxAmount;
    setFormData(prev => ({
      ...prev,
      taxAmount,
      totalAmount
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        description: '',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
        assetId: ''
      }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: newItems }));
      calculateTotals(newItems);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.vendor.trim()) newErrors.vendor = 'Vendor name is required';
    if (!formData.vendorId.trim()) newErrors.vendorId = 'Vendor ID is required';
    if (!formData.issueDate) newErrors.issueDate = 'Issue date is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    if (formData.issueDate && formData.dueDate) {
      if (new Date(formData.dueDate) <= new Date(formData.issueDate)) {
        newErrors.dueDate = 'Due date must be after issue date';
      }
    }

    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`items.${index}.description`] = 'Item description is required';
      }
      if (item.quantity <= 0) {
        newErrors[`items.${index}.quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unitPrice < 0) {
        newErrors[`items.${index}.unitPrice`] = 'Unit price must be positive';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit({
        ...formData,
        items: formData.items.map(item => ({
          ...item,
          assetId: item.assetId || undefined
        }))
      });
    } catch (error) {
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {invoice ? 'Edit Invoice' : 'Create New Invoice'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded"
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor Name *
              </label>
              <input
                type="text"
                value={formData.vendor}
                onChange={(e) => handleInputChange('vendor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {errors.vendor && (
                <p className="text-red-500 text-xs mt-1">{errors.vendor}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor ID *
              </label>
              <input
                type="text"
                value={formData.vendorId}
                onChange={(e) => handleInputChange('vendorId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {errors.vendorId && (
                <p className="text-red-500 text-xs mt-1">{errors.vendorId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date *
              </label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => handleInputChange('issueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {errors.issueDate && (
                <p className="text-red-500 text-xs mt-1">{errors.issueDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Items Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-blue-700 text-sm"
                disabled={loading}
              >
                <Plus className="w-3 h-3" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                      />
                      {errors[`items.${index}.description`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`items.${index}.description`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                      />
                      {errors[`items.${index}.quantity`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`items.${index}.quantity`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Unit Price *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                      />
                      {errors[`items.${index}.unitPrice`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`items.${index}.unitPrice`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Total Price
                      </label>
                      <input
                        type="number"
                        value={item.totalPrice}
                        readOnly
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Asset ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={item.assetId}
                      onChange={(e) => handleItemChange(index, 'assetId', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter asset ID if applicable"
                      disabled={loading}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="w-80 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${formData.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <label className="text-gray-600">Tax Amount:</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.taxAmount}
                    onChange={(e) => handleTaxChange(parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>${formData.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : invoice ? 'Update Invoice' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;