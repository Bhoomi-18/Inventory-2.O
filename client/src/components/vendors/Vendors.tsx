import React from 'react';
import { Plus } from 'lucide-react';
import VendorCard from './VendorCard';
import type { Vendor } from '../../types';
import { sampleVendors } from '../../data/mockData';

const Vendors: React.FC = () => {
  const handleViewDetails = (vendor: Vendor) => {
    console.log('View details for:', vendor.name);
  };

  const handleEdit = (vendor: Vendor) => {
    console.log('Edit vendor:', vendor.name);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600">Manage suppliers and vendor relationships</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add Vendor
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {sampleVendors.map((vendor) => (
          <VendorCard 
            key={vendor.id}
            vendor={vendor}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default Vendors;