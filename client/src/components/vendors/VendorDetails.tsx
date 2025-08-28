import React from 'react';
import { X, Building, Mail, Phone, MapPin, User, Calendar, Star } from 'lucide-react';
import type { Vendor } from '../../types/vendor';

interface VendorDetailsProps {
  vendor: Vendor | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (vendor: Vendor) => void;
}

const VendorDetails: React.FC<VendorDetailsProps> = ({ vendor, isOpen, onClose, onEdit }) => {
  if (!isOpen || !vendor) return null;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  const getStatusIconColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-blue-600 bg-blue-100';
      case 'Review':
        return 'text-red-600 bg-red-100';
      case 'Inactive':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Vendor Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Header with status */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${getStatusIconColor(vendor.status)} rounded-lg flex items-center justify-center`}>
                <Building className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{vendor.name}</h3>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(vendor.status)}`}>
                  {vendor.status}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-gray-600 leading-relaxed">{vendor.description}</p>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
              <div className="space-y-3">
                {vendor.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a 
                        href={`mailto:${vendor.email}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {vendor.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {vendor.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a 
                        href={`tel:${vendor.phone}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {vendor.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {vendor.contactPerson && (
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Contact Person</p>
                      <p className="text-gray-900 font-medium">{vendor.contactPerson}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Business Metrics</h4>
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-900">{vendor.totalOrders.toLocaleString()}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Total Value</p>
                  <p className="text-2xl font-bold text-green-900">${vendor.totalValue.toLocaleString()}</p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600 font-medium">Rating</p>
                      <p className="text-2xl font-bold text-yellow-900">{vendor.rating}/5</p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(vendor.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          {vendor.address && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Address</h4>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <p className="text-gray-600 leading-relaxed">{vendor.address}</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h4>
            <div className="space-y-2">
              {vendor.createdAt && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="text-gray-900 font-medium">{formatDate(vendor.createdAt)}</p>
                  </div>
                </div>
              )}
              
              {vendor.updatedAt && vendor.updatedAt !== vendor.createdAt && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-gray-900 font-medium">{formatDate(vendor.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(vendor)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Edit Vendor
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;