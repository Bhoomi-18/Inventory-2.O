import React from 'react';
import { Receipt, Calendar, Building, Eye } from 'lucide-react';
import type { Invoice } from '../../types';
import { formatCurrency, getStatusColor } from '../../utils';

interface InvoiceTableProps {
  invoices: Invoice[];
  onViewInvoice: (invoice: Invoice) => void;
  onMarkPaid: (invoiceId: string) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, onViewInvoice, onMarkPaid }) => (
  <div className="bg-white rounded-lg border border-gray-200">
    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Invoice Management</h3>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search invoices..."
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>Pending</option>
          <option>Paid</option>
          <option>Overdue</option>
        </select>
      </div>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4 text-sm font-medium text-gray-900">INVOICE</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">VENDOR</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">AMOUNT</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">ISSUE DATE</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">DUE DATE</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">STATUS</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <Receipt className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-500">{invoice.description}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{invoice.vendor}</span>
                </div>
              </td>
              <td className="p-4">
                <div>
                  <p className="font-medium text-gray-900">{formatCurrency(invoice.totalAmount)}</p>
                  <p className="text-xs text-gray-500">Tax: {formatCurrency(invoice.taxAmount)}</p>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{invoice.issueDate}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{invoice.dueDate}</span>
                </div>
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </span>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button 
                    onClick={() => onViewInvoice(invoice)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                  {invoice.status === 'Pending' && (
                    <button 
                      onClick={() => onMarkPaid(invoice.id)}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default InvoiceTable;