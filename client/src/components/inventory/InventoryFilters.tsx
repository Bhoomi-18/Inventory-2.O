import React from 'react';
import type { AssetFilters } from '../../types';

interface InventoryFiltersProps {
  filters: AssetFilters;
  onFiltersChange: (filters: AssetFilters) => void;
}

const InventoryFilters: React.FC<InventoryFiltersProps> = ({ filters, onFiltersChange }) => {
  const updateFilter = (key: keyof AssetFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex gap-4">
      <input
        type="text"
        placeholder="Search assets..."
        value={filters.search}
        onChange={(e) => updateFilter('search', e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select 
        value={filters.category}
        onChange={(e) => updateFilter('category', e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Categories</option>
        <option value="computers">Computers & Laptops</option>
        <option value="monitors">Monitors & Displays</option>
        <option value="mobile">Mobile Devices</option>
      </select>
      <select 
        value={filters.status}
        onChange={(e) => updateFilter('status', e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Status</option>
        <option value="Available">Available</option>
        <option value="Assigned">Assigned</option>
        <option value="Under Repair">Under Repair</option>
      </select>
      <select 
        value={filters.office}
        onChange={(e) => updateFilter('office', e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Offices</option>
        <option value="Main">Main Office</option>
      </select>
      <select 
        value={filters.vendor}
        onChange={(e) => updateFilter('vendor', e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Vendors</option>
        <option value="Apple">Apple</option>
        <option value="Dell">Dell</option>
      </select>
    </div>
  );
};

export default InventoryFilters;