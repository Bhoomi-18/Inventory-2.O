import React, { useState } from 'react';
import { Plus, QrCode } from 'lucide-react';
import InventoryFilters from './InventoryFilters';
import AssetTable from './AssetTable';
import type { AssetFilters } from '../../types';
import { sampleAssets } from '../../data/mockData';

const Inventory: React.FC = () => {
  const [filters, setFilters] = useState<AssetFilters>({
    search: '',
    category: '',
    status: '',
    office: '',
    vendor: ''
  });

  const handleBulkAssign = () => {
    // TODO: Implement bulk assign logic
    console.log('Bulk assign clicked');
  };

  const handleExport = () => {
    // TODO: Implement export logic
    console.log('Export clicked');
  };

  // Filter assets based on current filters
  const filteredAssets = sampleAssets.filter(asset => {
    return (
      (!filters.search || asset.name.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.category || asset.category.includes(filters.category)) &&
      (!filters.status || asset.status === filters.status) &&
      (!filters.office || asset.office === filters.office)
    );
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage all your assets and inventory</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700">
            <QrCode className="w-4 h-4" />
            Scan QR
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Add Asset
          </button>
        </div>
      </div>

      <InventoryFilters filters={filters} onFiltersChange={setFilters} />
      <AssetTable 
        assets={filteredAssets} 
        onBulkAssign={handleBulkAssign}
        onExport={handleExport}
      />
    </div>
  );
};

export default Inventory;