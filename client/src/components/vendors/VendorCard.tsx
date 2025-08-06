import React from 'react';
import { Building } from 'lucide-react';
import type { Vendor } from '../../types';

interface VendorCardProps {
  vendor: Vendor;
  onViewDetails: (vendor: Vendor) => void;
  onEdit: (vendor: Vendor) => void;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor, onViewDetails, onEdit }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 ${
          vendor.status === 'Active' ? 'bg-blue-100' : vendor.status === 'Review' ? 'bg-red-100' : 'bg-gray-100'
        } rounded-lg flex items-center justify-center`}>
          <Building className={`w-6 h-6 ${
            vendor.status === 'Active' ? 'text-blue-600' : vendor.status === 'Review' ? 'text-red-600' : 'text-gray-600'
          }`} />
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          vendor.status === 'Active' 
            ? 'bg-green-100 text-green-800'
            : vendor.status === 'Review'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {vendor.status}
        </span>
      </div>
    </div>
    
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{vendor.name}</h3>
    <p className="text-sm text-gray-600 mb-4">{vendor.description}</p>
    
    <div className="space-y-2 mb-4">
      <div className="flex justify-between">
        <span className="text-sm text-gray-600">Total Orders:</span>
        <span className="text-sm font-medium text-gray-900">{vendor.totalOrders}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-gray-600">Total Value:</span>
        <span className="text-sm font-medium text-gray-900">
          ${vendor.totalValue.toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Rating:</span>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ⭐
            </div>
          ))}
          <span className="text-sm font-medium text-gray-900 ml-1">
            ({vendor.rating})
          </span>
        </div>
      </div>
    </div>
    
    <div className="flex gap-2">
      <button 
        onClick={() => onViewDetails(vendor)}
        className="flex-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        View Details
      </button>
      <button 
        onClick={() => onEdit(vendor)}
        className="flex-1 text-gray-600 hover:text-gray-800 text-sm font-medium"
      >
        Edit
      </button>
    </div>
  </div>
);

export default VendorCard;