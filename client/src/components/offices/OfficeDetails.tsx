import React from 'react';
import { X, MapPin, Phone, Mail, User, Users, Package, Building, Trash2, Edit3 } from 'lucide-react';
import type { Office } from '../../types/office';
import { getStatusColor } from '../../utils';

interface OfficeDetailsProps {
  office: Office | null;
  onClose: () => void;
  onEdit: (office: Office) => void;
  onDelete: (office: Office) => void;
  isOpen: boolean;
}

const OfficeDetails: React.FC<OfficeDetailsProps> = ({ 
  office, 
  onClose, 
  onEdit, 
  onDelete, 
  isOpen 
}) => {
  if (!isOpen || !office) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              office.isMain ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              <Building className={`w-5 h-5 ${
                office.isMain ? 'text-green-600' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-900">{office.name}</h2>
                {office.isMain && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Main Office
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">Code: {office.code}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(office.status)}`}>
              {office.status}
            </span>
          </div>

          {/* Address */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              Address
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-700">
                {office.address.street && <p>{office.address.street}</p>}
                {(office.address.city || office.address.state || office.address.zipCode) && (
                  <p>{office.address.city}{office.address.city && office.address.state ? ', ' : ''}{office.address.state} {office.address.zipCode}</p>
                )}
                {office.address.country && <p>{office.address.country}</p>}
                {!office.address.street && !office.address.city && !office.address.country && (
                  <p className="text-gray-500 italic">No address provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {office.contactInfo.phone ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-gray-600">{office.contactInfo.phone}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-gray-500 italic">Not provided</p>
                  </div>
                </div>
              )}

              {office.contactInfo.email ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-gray-600">{office.contactInfo.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-gray-500 italic">Not provided</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Manager */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              Manager
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                {office.manager || <span className="italic text-gray-500">No manager assigned</span>}
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-600">{office.employees}</p>
                <p className="text-sm text-blue-800">Employees</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">{office.totalAssets}</p>
                <p className="text-sm text-green-800">Total Assets</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-orange-600">{office.availableAssets}</p>
                <p className="text-sm text-orange-800">Available</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Assigned Assets:</span>
                <span className="font-semibold text-gray-900">{office.assignedAssets}</span>
              </div>
            </div>
          </div>

          {/* Created Date */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Created:</span>
              <span className="font-medium text-gray-900">
                {new Date(office.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end p-6 border-t border-gray-200">
          {!office.isMain && (
            <button
              onClick={() => onDelete(office)}
              className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Office
            </button>
          )}
          <button
            onClick={() => onEdit(office)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit Office
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfficeDetails;