import React, { useState } from 'react';
import { Receipt, Calendar, Building, Eye, Trash2, Search } from 'lucide-react';
import type { Invoice } from '../../types';
import { formatCurrency, getStatusColor } from '../../utils';

interface InvoiceTableProps {
  invoices: Invoice[];
  onViewInvoice: (invoice: Invoice) => void;
  onMarkPaid: (invoiceId: string) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  onEditInvoice: (invoice: Invoice) => void;
  onSearch: (query: string) => void;
  onStatusFilter: (status: string) => void;
  loading?: boolean;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ 
  invoices, 
  onViewInvoice, 
  onMarkPaid, 
  onDeleteInvoice,
  onEditInvoice,
  onSearch,
  onStatusFilter,
  loading = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setStatusFilter(status);
    onStatusFilter(status);
  };

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId)
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === invoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(invoices.map(invoice => invoice.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Invoice Management</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9 pr-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={handleStatusChange}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {invoices.length === 0 ? (
        <div className="p-8 text-center">
          <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No invoices found</p>
          <p className="text-gray-400 text-sm">Create your first invoice to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedInvoices.length === invoices.length && invoices.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
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
                    <input
                      type="checkbox"
                      checked={selectedInvoices.includes(invoice.id)}
                      onChange={() => handleSelectInvoice(invoice.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Receipt className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{invoice.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-900">{invoice.vendor}</span>
                        <p className="text-xs text-gray-500">ID: {invoice.vendorId}</p>
                      </div>
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
                      <span className="text-sm text-gray-900">{formatDate(invoice.issueDate)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{formatDate(invoice.dueDate)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onViewInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50"
                        title="View Invoice"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                      
                      <button 
                        onClick={() => onEditInvoice(invoice)}
                        className="text-gray-600 hover:text-gray-800 text-sm px-2 py-1 rounded hover:bg-gray-50"
                        title="Edit Invoice"
                      >
                        Edit
                      </button>

                      {(invoice.status === 'Pending' || invoice.status === 'Overdue') && (
                        <button 
                          onClick={() => onMarkPaid(invoice.id)}
                          className="text-green-600 hover:text-green-800 text-sm px-2 py-1 rounded hover:bg-green-50"
                          title="Mark as Paid"
                        >
                          Pay
                        </button>
                      )}

                      <button 
                        onClick={() => onDeleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedInvoices.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedInvoices.length} invoice{selectedInvoices.length !== 1 ? 's' : ''} selected
            </span>
            <button 
              onClick={() => {
                if (window.confirm('Are you sure you want to delete the selected invoices?')) {
                  selectedInvoices.forEach(id => onDeleteInvoice(id));
                  setSelectedInvoices([]);
                }
              }}
              className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1 px-3 py-1 rounded hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3" />
              Delete Selected
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceTable;