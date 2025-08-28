import React, { useState } from 'react';
import { Package, Download, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Asset } from '../../types/asset';

interface AssetTableProps {
  assets: Asset[];
  loading?: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  onExport: () => void;
  onEdit: (asset: Asset) => void;
  onDelete: (assetId: string) => void;
  onPageChange: (page: number) => void;
}

const AssetTable: React.FC<AssetTableProps> = ({ 
  assets, 
  loading = false,
  pagination,
  onExport,
  onEdit,
  onDelete,
  onPageChange
}) => {
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAssets(new Set(assets.map(asset => asset._id)));
    } else {
      setSelectedAssets(new Set());
    }
  };

  const handleSelectAsset = (assetId: string, checked: boolean) => {
    const newSelected = new Set(selectedAssets);
    if (checked) {
      newSelected.add(assetId);
    } else {
      newSelected.delete(assetId);
    }
    setSelectedAssets(newSelected);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800';
      case 'Under Repair':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent':
        return 'bg-green-100 text-green-800';
      case 'Good':
        return 'bg-blue-100 text-blue-800';
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'Poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const allSelected = assets.length > 0 && selectedAssets.size === assets.length;
  const someSelected = selectedAssets.size > 0 && selectedAssets.size < assets.length;

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Table Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input 
            type="checkbox"
            className="rounded"
            checked={allSelected}
            ref={input => {
              if (input) input.indeterminate = someSelected;
            }}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <span className="text-sm text-gray-600">
            {selectedAssets.size > 0 ? `${selectedAssets.size} selected` : 'Select All'}
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onExport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-900">ASSET</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">SERIAL NUMBER</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">CATEGORY</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">STATUS</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">CONDITION</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">ASSIGNED TO</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">LOCATION</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">PURCHASE PRICE</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assets.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-500">
                  No assets found. Try adjusting your filters or add a new asset.
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        className="rounded"
                        checked={selectedAssets.has(asset._id)}
                        onChange={(e) => handleSelectAsset(asset._id, e.target.checked)}
                      />
                      <Package className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{asset.name}</p>
                        <p className="text-sm text-gray-500">
                          {asset.vendor} • {formatDate(asset.purchaseDate)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-900">{asset.serialNumber}</td>
                  <td className="p-4 text-sm text-gray-900">{asset.category}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(asset.condition)}`}>
                      {asset.condition}
                    </span>
                  </td>
                  <td className="p-4">
                    {asset.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {asset.assignedTo.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <span className="text-sm text-gray-900">{asset.assignedTo}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-900">{asset.location}</td>
                  <td className="p-4 text-sm text-gray-900">{formatCurrency(asset.purchasePrice)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(asset)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Edit asset"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(asset._id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} assets
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                let pageNum;
                if (pagination.pages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      pageNum === pagination.page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetTable;