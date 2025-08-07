import React from 'react';
import { X, Download, Printer, Building } from 'lucide-react';
import type { Invoice } from '../../types';
import { formatCurrency } from '../../utils';

interface InvoiceDetailProps {
  invoice: Invoice;
  onClose: () => void;
  onDownload: () => void;
  onPrint: () => void;
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoice, onClose, onDownload, onPrint }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
        <div className="flex gap-2">
          <button onClick={onDownload} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
            <Download className="w-4 h-4" />
          </button>
          <button onClick={onPrint} className="p-2 text-gray-600 hover:bg-gray-50 rounded">
            <Printer className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-2 text-gray-600 hover:bg-gray-50 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Invoice Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice Number:</span>
              <span className="font-medium">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Issue Date:</span>
              <span className="font-medium">{invoice.issueDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date:</span>
              <span className="font-medium">{invoice.dueDate}</span>
            </div>
            {invoice.paidDate && (
              <div className="flex justify-between">
                <span className="text-gray-600">Paid Date:</span>
                <span className="font-medium text-green-600">{invoice.paidDate}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Vendor Information</h3>
          <div className="flex items-center gap-2 mb-2">
            <Building className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{invoice.vendor}</span>
          </div>
          <div className="text-sm text-gray-600">
            <p>Vendor ID: {invoice.vendorId}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Invoice Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-gray-900">DESCRIPTION</th>
                <th className="text-left p-3 text-sm font-medium text-gray-900">QUANTITY</th>
                <th className="text-left p-3 text-sm font-medium text-gray-900">UNIT PRICE</th>
                <th className="text-left p-3 text-sm font-medium text-gray-900">TOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="p-3">
                    <div>
                      <p className="font-medium text-gray-900">{item.description}</p>
                      {item.assetId && (
                        <p className="text-xs text-gray-500">Asset ID: {item.assetId}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-gray-900">{item.quantity}</td>
                  <td className="p-3 text-gray-900">{formatCurrency(item.unitPrice)}</td>
                  <td className="p-3 font-medium text-gray-900">{formatCurrency(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(invoice.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>{formatCurrency(invoice.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default InvoiceDetail;