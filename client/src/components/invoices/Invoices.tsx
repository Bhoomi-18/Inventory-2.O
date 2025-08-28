import React, { useState, useCallback } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import InvoiceStats from './InvoiceStats';
import InvoiceTable from './InvoiceTable';
import InvoiceDetail from './InvoiceDetail';
import InvoiceForm from './InvoiceForm';
import type { Invoice } from '../../types';
import { useInvoices } from '../../hooks/useInvoice';
import type { CreateInvoiceRequest } from '../../services/invoiceService';

const Invoices: React.FC = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const {
    invoices,
    loading,
    error,
    pagination,
    loadInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    markInvoicePaid,
    refetch
  } = useInvoices({
    initialQuery: {
      page: currentPage,
      limit: 20,
      search: searchQuery || undefined,
      status: statusFilter || undefined
    },
    autoLoad: true
  });

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleCloseDetail = () => {
    setSelectedInvoice(null);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceForm(true);
    setSelectedInvoice(null);
  };

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setShowInvoiceForm(true);
  };

  const handleCloseForm = () => {
    setShowInvoiceForm(false);
    setEditingInvoice(null);
  };

  const handleSubmitInvoice = async (invoiceData: CreateInvoiceRequest) => {
    try {
      if (editingInvoice) {
        await updateInvoice(editingInvoice.id, invoiceData);
      } else {
        await createInvoice(invoiceData);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Submit invoice error:', error);
      throw error; 
    }
  };

  const handleMarkPaid = async (invoiceId: string) => {
    try {
      await markInvoicePaid(invoiceId);
    } catch (error) {
      console.error('Mark paid error:', error);
      alert('Failed to mark invoice as paid. Please try again.');
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteInvoice(invoiceId);
      } catch (error) {
        console.error('Delete invoice error:', error);
        alert('Failed to delete invoice. Please try again.');
      }
    }
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    loadInvoices({
      page: 1,
      limit: 20,
      search: query || undefined,
      status: statusFilter || undefined
    });
  }, [statusFilter, loadInvoices]);

  const handleStatusFilter = useCallback((status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    loadInvoices({
      page: 1,
      limit: 20,
      search: searchQuery || undefined,
      status: status || undefined
    });
  }, [searchQuery, loadInvoices]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadInvoices({
      page,
      limit: 20,
      search: searchQuery || undefined,
      status: statusFilter || undefined
    });
  };

  const handleDownload = () => {
    if (selectedInvoice) {
      console.log('Downloading invoice:', selectedInvoice.invoiceNumber);
    }
  };

  const handlePrint = () => {
    if (selectedInvoice) {
      console.log('Printing invoice:', selectedInvoice.invoiceNumber);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Invoices</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600">Track and manage vendor invoices</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleRefresh}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={handleCreateInvoice}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
        </div>
      </div>

      <InvoiceStats />
      
      <InvoiceTable 
        invoices={invoices}
        loading={loading}
        onViewInvoice={handleViewInvoice}
        onEditInvoice={handleEditInvoice}
        onMarkPaid={handleMarkPaid}
        onDeleteInvoice={handleDeleteInvoice}
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">
                {((currentPage - 1) * 20) + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(currentPage * 20, pagination.totalItems)}
              </span>{' '}
              of{' '}
              <span className="font-medium">{pagination.totalItems}</span>{' '}
              results
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {/* Page Numbers */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const page = Math.max(1, currentPage - 2) + i;
              if (page > pagination.totalPages) return null;
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    page === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <InvoiceDetail 
          invoice={selectedInvoice}
          onClose={handleCloseDetail}
          onDownload={handleDownload}
          onPrint={handlePrint}
          onEdit={() => handleEditInvoice(selectedInvoice)}
        />
      )}

      {/* Invoice Form Modal */}
      {showInvoiceForm && (
        <InvoiceForm
          invoice={editingInvoice}
          onSubmit={handleSubmitInvoice}
          onClose={handleCloseForm}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Invoices;