import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { AssetFilters } from '../../types/asset';

interface InventoryFiltersProps {
  filters: AssetFilters;
  onFiltersChange: (filters: AssetFilters) => void;
}

const categories = [
  'Computers & Laptops',
  'Monitors & Displays',
  'Mobile Devices',
  'Network Equipment',
  'Office Equipment',
  'Other'
];

const statuses = ['Available', 'Assigned', 'Under Repair'];

const InventoryFilters: React.FC<InventoryFiltersProps> = ({ 
  filters, 
  onFiltersChange 
}) => {
  const updateFilter = (key: keyof AssetFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: '',
      status: '',
      office: '',
      vendor: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search assets by name, serial number, or vendor..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-3">
          <select 
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select 
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Location"
            value={filters.office}
            onChange={(e) => updateFilter('office', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
          />

          <input
            type="text"
            placeholder="Vendor"
            value={filters.vendor}
            onChange={(e) => updateFilter('vendor', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
          />

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Active filters:</span>
            
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: "{filters.search}"
                <button 
                  onClick={() => updateFilter('search', '')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Category: {filters.category}
                <button 
                  onClick={() => updateFilter('category', '')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.status && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Status: {filters.status}
                <button 
                  onClick={() => updateFilter('status', '')}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.office && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                Location: {filters.office}
                <button 
                  onClick={() => updateFilter('office', '')}
                  className="ml-1 text-orange-600 hover:text-orange-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.vendor && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                Vendor: {filters.vendor}
                <button 
                  onClick={() => updateFilter('vendor', '')}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryFilters;