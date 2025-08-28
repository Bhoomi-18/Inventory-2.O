import React, { useState } from 'react';
import { Building, Star, MoreVertical, Edit, Eye, Trash2 } from 'lucide-react';
import type { Vendor } from '../../types/vendor';

interface VendorCardProps {
  vendor: Vendor;
  onViewDetails: (vendor: Vendor) => void;
  onEdit: (vendor: Vendor) => void;
  onDelete?: (vendor: Vendor) => void;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor, onViewDetails, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-600';
      case 'Review':
        return 'bg-red-100 text-red-600';
      case 'Inactive':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleActionClick = (action: () => void) => {
    setShowMenu(false);
    action();
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer relative">
      {/* Menu Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleMenuClick}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
        
        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute right-0 top-8 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            <button
              onClick={() => handleActionClick(() => onViewDetails(vendor))}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            <button
              onClick={() => handleActionClick(() => onEdit(vendor))}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            {onDelete && (
              <>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={() => handleActionClick(() => onDelete(vendor))}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div onClick={() => onViewDetails(vendor)}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${getIconColor(vendor.status)} rounded-lg flex items-center justify-center`}>
              <Building className="w-6 h-6" />
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vendor.status)}`}>
              {vendor.status}
            </span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-8">{vendor.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{vendor.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Orders:</span>
            <span className="text-sm font-medium text-gray-900">{vendor.totalOrders.toLocaleString()}</span>
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
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(vendor.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm font-medium text-gray-900 ml-1">
                ({vendor.rating})
              </span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        {(vendor.email || vendor.phone || vendor.contactPerson) && (
          <div className="pt-4 border-t border-gray-100">
            <div className="space-y-1">
              {vendor.contactPerson && (
                <p className="text-xs text-gray-500">
                  Contact: <span className="text-gray-700">{vendor.contactPerson}</span>
                </p>
              )}
              {vendor.email && (
                <p className="text-xs text-gray-500">
                  Email: <span className="text-gray-700">{vendor.email}</span>
                </p>
              )}
              {vendor.phone && (
                <p className="text-xs text-gray-500">
                  Phone: <span className="text-gray-700">{vendor.phone}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorCard;