import React from 'react';
import { X, Download, Printer, Building, Edit } from 'lucide-react';
import type { Invoice } from '../../types';
import { formatCurrency, getStatusColor } from '../../utils';

interface InvoiceDetailProps {
  invoice: Invoice;
  onClose: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onEdit: () => void;
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ 
  invoice, 
  onClose, 
  onDownload, 
  onPrint,
  onEdit 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    const printContent = document.getElementById('invoice-content');
    if (printContent) {
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  const handleDownload = () => {
    const invoiceData = {
      invoiceNumber: invoice.invoiceNumber,
      vendor: invoice.vendor,
      amount: invoice.totalAmount,
      date: invoice.issueDate
    };
    
    const dataStr = JSON.stringify(invoiceData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `invoice-${invoice.invoiceNumber}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
          <div className="flex gap-2">
            <button 
              onClick={onEdit} 
              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              title="Edit Invoice"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={handleDownload} 
              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              title="Download Invoice"
            >
              <Download className="w-4 h-4" />
            </button>
            <button 
              onClick={handlePrint} 
              className="p-2 text-gray-600 hover:bg-gray-50 rounded"
              title="Print Invoice"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-600 hover:bg-gray-50 rounded"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div id="invoice-content">
          {/* Invoice Header */}
          <div className="mb-8 text-center border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-semibold text-gray-700">Invoice #{invoice.invoiceNumber}</p>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-2 ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Issue Date</p>
                <p className="font-semibold">{formatDate(invoice.issueDate)}</p>
                <p className="text-sm text-gray-600 mt-2">Due Date</p>
                <p className="font-semibold">{formatDate(invoice.dueDate)}</p>
                {invoice.paidDate && (
                  <>
                    <p className="text-sm text-gray-600 mt-2">Paid Date</p>
                    <p className="font-semibold text-green-600">{formatDate(invoice.paidDate)}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Vendor Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-gray-400" />
                Vendor Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900 text-lg">{invoice.vendor}</p>
                <p className="text-gray-600 text-sm mt-1">Vendor ID: {invoice.vendorId}</p>
              </div>
            </div>

            {/* Invoice Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{invoice.items.length}</span>
                </div>
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
                  <span className="text-blue-600">{formatCurrency(invoice.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{invoice.description}</p>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-900 border-b">DESCRIPTION</th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-900 border-b">QTY</th>
                    <th className="text-right p-4 text-sm font-semibold text-gray-900 border-b">UNIT PRICE</th>
                    <th className="text-right p-4 text-sm font-semibold text-gray-900 border-b">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{item.description}</p>
                          {item.assetId && (
                            <p className="text-xs text-gray-500 mt-1">Asset ID: {item.assetId}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center text-gray-900">{item.quantity}</td>
                      <td className="p-4 text-right text-gray-900">{formatCurrency(item.unitPrice)}</td>
                      <td className="p-4 text-right font-medium text-gray-900">{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="p-4 text-right font-semibold text-gray-900">Subtotal:</td>
                    <td className="p-4 text-right font-semibold text-gray-900">{formatCurrency(invoice.amount)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="p-4 text-right font-semibold text-gray-900">Tax:</td>
                    <td className="p-4 text-right font-semibold text-gray-900">{formatCurrency(invoice.taxAmount)}</td>
                  </tr>
                  <tr className="border-t-2 border-gray-300">
                    <td colSpan={3} className="p-4 text-right text-lg font-bold text-gray-900">Total:</td>
                    <td className="p-4 text-right text-lg font-bold text-blue-600">{formatCurrency(invoice.totalAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm border-t pt-6">
            <p>This invoice was generated on {formatDate(new Date().toISOString())}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;