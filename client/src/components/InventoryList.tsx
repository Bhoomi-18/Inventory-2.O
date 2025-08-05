// client/src/components/InventoryList.tsx
import React, { useState, useEffect } from 'react';
import { useAuth, apiCall, type Asset } from '../App';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  UserPlus, 
  UserMinus,
  AlertCircle
} from 'lucide-react';

const InventoryList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchAssets();
  }, [statusFilter, categoryFilter]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      
      const data = await apiCall(`/inventory?${params.toString()}`);
      setAssets(data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assetId: string) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    
    try {
      await apiCall(`/inventory/${assetId}`, { method: 'DELETE' });
      setAssets(assets.filter(asset => asset._id !== assetId));
    } catch (error) {
      console.error('Failed to delete asset:', error);
    }
  };

  const handleAssign = async (assetId: string) => {
    // This would typically open a modal to select user
    // For demo purposes, we'll show an alert
    alert('Assignment functionality would open a user selection modal');
  };

  const handleReturn = async (assetId: string) => {
    try {
      await apiCall(`/inventory/${assetId}/return`, { method: 'POST' });
      fetchAssets(); // Refresh the list
    } catch (error) {
      console.error('Failed to return asset:', error);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = searchTerm === '' || 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.modelName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      available: 'bg-green-100 text-green-800',
      assigned: 'bg-yellow-100 text-yellow-800',
      maintenance: 'bg-red-100 text-red-800',
      retired: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your IT assets and equipment</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => navigate('/inventory/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="monitor">Monitor</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
              <option value="printer">Printer</option>
              <option value="router">Router</option>
              <option value="switch">Switch</option>
              <option value="server">Server</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredAssets.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first asset.'
              }
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredAssets.map((asset) => (
              <li key={asset._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {asset.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {asset.assetTag} • {asset.brand} {asset.modelName}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(asset.status)}
                        <span className="text-xs text-gray-500 capitalize">
                          {asset.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span>Location: {asset.location}</span>
                      {asset.assignedTo && (
                        <span className="ml-4">
                          Assigned to: {asset.assignedTo.name}
                        </span>
                      )}
                      <span className="ml-4">
                        ${asset.purchasePrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {(user?.role === 'admin' || user?.role === 'manager') && (
                    <div className="ml-4 flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/inventory/edit/${asset._id}`)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full"
                        title="Edit Asset"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      {asset.status === 'available' && (
                        <button
                          onClick={() => handleAssign(asset._id)}
                          className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-full"
                          title="Assign Asset"
                        >
                          <UserPlus className="h-4 w-4" />
                        </button>
                      )}
                      
                      {asset.status === 'assigned' && (
                        <button
                          onClick={() => handleReturn(asset._id)}
                          className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-full"
                          title="Return Asset"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      )}
                      
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => handleDelete(asset._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                          title="Delete Asset"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="text-sm text-gray-600">
          Showing {filteredAssets.length} of {assets.length} assets
        </div>
      </div>
    </div>
  );
};

export default InventoryList;