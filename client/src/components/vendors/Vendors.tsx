import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, RefreshCw, AlertCircle, Loader, Building } from 'lucide-react';
import VendorCard from './VendorCard';
import VendorForm from './VendorForm';
import VendorDetails from './VendorDetails';
import { useVendors } from '../../hooks/useVendors';
import type { Vendor } from '../../types/vendor';

const Vendors: React.FC = () => {
  const {
    vendors,
    pagination,
    loading,
    error,
    loadVendors,
    createVendor,
    updateVendor,
    deleteVendor,
    clearError
  } = useVendors();

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Review' | 'Inactive'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormLoading, setIsFormLoading] = useState(false);

  useEffect(() => {
    const filters = {
      page: currentPage,
      limit: 12,
      ...(statusFilter !== 'All' && { status: statusFilter }),
      ...(searchTerm && { search: searchTerm })
    };
    loadVendors(filters);
  }, [loadVendors, currentPage, statusFilter, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: 'All' | 'Active' | 'Review' | 'Inactive') => {
    setStatusFilter(status);
    setCurrentPage(1); 
  };

  const handleViewDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsDetailsOpen(true);
  };

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsFormOpen(true);
    setIsDetailsOpen(false);
  };

  const handleAddNew = () => {
    setSelectedVendor(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    setIsFormLoading(true);
    try {
      let success;
      if (selectedVendor) {
        success = await updateVendor(selectedVendor.id, data);
      } else {
        success = await createVendor(data);
      }
      if (success) {
        setIsFormOpen(false);
        setSelectedVendor(null);
      }
      return success;
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDelete = async (vendor: Vendor) => {
    if (window.confirm(`Are you sure you want to delete "${vendor.name}"? This action cannot be undone.`)) {
      const success = await deleteVendor(vendor.id);
      if (success) {
        console.log('Vendor deleted successfully');
        if (selectedVendor && selectedVendor.id === vendor.id) {
          setIsDetailsOpen(false);
          setSelectedVendor(null);
        }
      }
    }
  };

  const handleRefresh = () => {
    const filters = {
      page: currentPage,
      limit: 12,
      ...(statusFilter !== 'All' && { status: statusFilter }),
      ...(searchTerm && { search: searchTerm })
    };
    loadVendors(filters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusCount = (status: string) => {
    return vendors.filter(vendor => status === 'All' || vendor.status === status).length;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600">Manage suppliers and vendor relationships</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Vendor
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div className="flex-1">
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800"
          >
            <Plus className="w-4 h-4 rotate-45" />
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search vendors by name, description, or contact person..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status ({getStatusCount('All')})</option>
            <option value="Active">Active ({getStatusCount('Active')})</option>
            <option value="Review">Review ({getStatusCount('Review')})</option>
            <option value="Inactive">Inactive ({getStatusCount('Inactive')})</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && vendors.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading vendors...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && vendors.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'All' ? 'No vendors found' : 'No vendors yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'All' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first vendor'
            }
          </p>
          {!searchTerm && statusFilter === 'All' && (
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add Your First Vendor
            </button>
          )}
        </div>
      )}

      {/* Vendor Grid */}
      {!loading && vendors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNext}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(currentPage - 1) * 12 + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * 12, pagination.totalItems)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.totalItems}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    return page === 1 || 
                           page === pagination.totalPages || 
                           Math.abs(page - currentPage) <= 1;
                  })
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && array[index - 1] < page - 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && (
                          <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            page === currentPage
                              ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <VendorForm
        vendor={isFormOpen && selectedVendor ? selectedVendor : undefined}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedVendor(null);
        }}
        onSubmit={handleFormSubmit}
        isLoading={isFormLoading}
      />

      <VendorDetails
        vendor={isDetailsOpen ? selectedVendor : null}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedVendor(null);
        }}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default Vendors;