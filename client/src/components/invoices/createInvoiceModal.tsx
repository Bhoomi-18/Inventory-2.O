import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { CreateInvoiceRequest } from '../../services/invoiceService';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  assetId?: string;
}

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInvoiceRequest) => void;
  loading?: boolean;
  vendors?: Array<{ id: string; name: string; }>;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  vendors = []
}) => {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    vendor: '',
    vendorId: '',
    taxAmount: 0,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    description: ''
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, unitPrice: 0 }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.issueDate && !formData.dueDate) {
      const issueDate = new Date(formData.issueDate);
      const dueDate = new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.issueDate, formData.dueDate]);

  useEffect(() => {
    if (isOpen && !formData.invoiceNumber) {
      const timestamp = Date.now().toString().slice(-6);
      setFormData(prev => ({
        ...prev,
        invoiceNumber: `INV-${timestamp}`
      }));
    }
  }, [isOpen, formData.invoiceNumber]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleVendorChange = (vendorName: string) => {
    const selectedVendor = vendors.find(v => v.name === vendorName);
    setFormData(prev => ({
      ...prev,
      vendor: vendorName,
      vendorId: selectedVendor?.id || vendorName
    }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    setItems(prev => [...prev, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + formData.taxAmount;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.invoiceNumber.trim()) newErrors.invoiceNumber = 'Invoice number is required';
    if (!formData.vendor.trim()) newErrors.vendor = 'Vendor is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.issueDate) newErrors.issueDate = 'Issue date is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (new Date(formData.dueDate) <= new Date(formData.issueDate)) {
      newErrors.dueDate = 'Due date must be after issue date';
    }

    items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item-${index}-description`] = 'Item description is required';
      }
      if (item.quantity <= 0) {
        newErrors[`item-${index}-quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unitPrice < 0) {
        newErrors[`item-${index}-unitPrice`] = 'Unit price cannot be negative';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data: CreateInvoiceRequest = {
      ...formData,
      items: items.map(item => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.quantity) * Number(item.unitPrice)
      })),
      amount: items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
      totalAmount: calculateTotal()
    };

    onSubmit(data);
  };

  const resetForm = () => {
    setFormData({
      invoiceNumber: '',
      vendor: '',
      vendorId: '',
      taxAmount: 0,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      description: ''
    });
    setItems([{ description: '', quantity: 1, unitPrice: 0 }]);
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Invoice</h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Number *
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.invoiceNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., INV-001"
              />
              {errors.invoiceNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.invoiceNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor *
              </label>
              {vendors.length > 0 ? (
                <select
                  value={formData.vendor}
                  onChange={(e) => handleVendorChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.vendor ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.name}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => handleInputChange('vendor', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.vendor ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter vendor name"
                />
              )}
              {errors.vendor && (
                <p className="text-red-500 text-sm mt-1">{errors.vendor}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date *
              </label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => handleInputChange('issueDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.issueDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.issueDate && (
                <p className="text-red-500 text-sm mt-1">{errors.issueDate}</p>
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.taxAmount}
                onChange={(e) => handleInputChange('taxAmount', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter invoice description..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end p-3 border border-gray-200 rounded-lg">
                  <div className="col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${
                        errors[`item-${index}-description`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Item description"
                    />
                    {errors[`item-${index}-description`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`item-${index}-description`]}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${
                        errors[`item-${index}-quantity`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`item-${index}-quantity`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`item-${index}-quantity`]}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${
                        errors[`item-${index}-unitPrice`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`item-${index}-unitPrice`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`item-${index}-unitPrice`]}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total
                    </label>
                    <div className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm font-medium">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </div>
                  </div>

                  <div className="col-span-1">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">${formData.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end border-t pt-6">
            <button
              type="button"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;