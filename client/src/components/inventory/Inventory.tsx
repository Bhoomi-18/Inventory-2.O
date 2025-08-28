import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import InventoryFilters from './InventoryFilters';
import AssetTable from './AssetTable';
import AssetForm from './AssetForm';
import Modal from '../common/Modal';
import { useAssets } from '../../hooks/useAssets';
import type { AssetFilters, Asset } from '../../types/asset';

const Inventory: React.FC = () => {
  const [filters, setFilters] = useState<AssetFilters>({
    search: '',
    category: '',
    status: '',
    office: '',
    vendor: ''
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    assets,
    loading,
    error,
    pagination,
    updateQuery,
    createAsset,
    updateAsset,
    deleteAsset,
    refresh
  } = useAssets({
    page: 1,
    limit: 10
  });

  useEffect(() => {
    const queryParams: any = { page: 1 }; 
    
    if (filters.search) queryParams.search = filters.search;
    if (filters.category) queryParams.category = filters.category;
    if (filters.status) queryParams.status = filters.status;
    if (filters.office) queryParams.location = filters.office; 
    
    updateQuery(queryParams);
  }, [filters, updateQuery]);

  const handleExport = () => {
    const headers = ['Name', 'Serial Number', 'Category', 'Status', 'Assigned To', 'Location', 'Purchase Date', 'Vendor'];
    const csvData = assets.map(asset => [
      asset.name,
      asset.serialNumber,
      asset.category,
      asset.status,
      asset.assignedTo || '',
      asset.location,
      new Date(asset.purchaseDate).toLocaleDateString(),
      asset.vendor
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assets_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleCreateAsset = () => {
    setEditingAsset(null);
    setIsFormOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setIsFormOpen(true);
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteAsset(assetId);
    } catch (error: any) {
      alert(`Error deleting asset: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      if (editingAsset) {
        await updateAsset(editingAsset._id, formData);
      } else {
        await createAsset(formData);
      }
      setIsFormOpen(false);
      setEditingAsset(null);
    } catch (error: any) {
      alert(`Error ${editingAsset ? 'updating' : 'creating'} asset: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    updateQuery({ page });
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading assets</h3>
          <p className="text-red-600 mt-1">{error}</p>
          <button 
            onClick={refresh}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
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
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage all your assets and inventory</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleCreateAsset}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add Asset
          </button>
        </div>
      </div>

      <InventoryFilters filters={filters} onFiltersChange={setFilters} />
      
      <AssetTable 
        assets={assets}
        loading={loading}
        pagination={pagination}
        onExport={handleExport}
        onEdit={handleEditAsset}
        onDelete={handleDeleteAsset}
        onPageChange={handlePageChange}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAsset(null);
        }}
        title={editingAsset ? 'Edit Asset' : 'Add New Asset'}
      >
        <AssetForm
          asset={editingAsset}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingAsset(null);
          }}
          loading={isLoading}
        />
      </Modal>
    </div>
  );
};

export default Inventory;