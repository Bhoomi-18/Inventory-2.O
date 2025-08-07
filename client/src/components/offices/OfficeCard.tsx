import React from 'react';
import { MapPin, Phone, Mail, Users, Package, User, Building } from 'lucide-react';
import type { Office } from '../../types';
import { getStatusColor } from '../../utils';

interface OfficeCardProps {
  office: Office;
  onViewDetails: (office: Office) => void;
  onEdit: (office: Office) => void;
}

const OfficeCard: React.FC<OfficeCardProps> = ({ office, onViewDetails, onEdit }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Building className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{office.name}</h3>
          <p className="text-sm text-gray-500">Code: {office.code}</p>
        </div>
      </div>
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(office.status)}`}>
        {office.status}
      </span>
    </div>

    <div className="space-y-3 mb-4">
      <div className="flex items-start gap-2">
        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
        <div className="text-sm text-gray-600">
          <p>{office.address.street}</p>
          <p>{office.address.city}, {office.address.state} {office.address.zipCode}</p>
          <p>{office.address.country}</p>
        </div>
      </div>

      {office.contactInfo.phone && (
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{office.contactInfo.phone}</span>
        </div>
      )}

      {office.contactInfo.email && (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{office.contactInfo.email}</span>
        </div>
      )}

      {office.manager && (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Manager: {office.manager}</span>
        </div>
      )}
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="text-center p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center gap-1 mb-1">
          <Users className="w-4 h-4 text-gray-600" />
        </div>
        <p className="text-lg font-semibold text-gray-900">{office.employees}</p>
        <p className="text-xs text-gray-600">Employees</p>
      </div>
      <div className="text-center p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center gap-1 mb-1">
          <Package className="w-4 h-4 text-gray-600" />
        </div>
        <p className="text-lg font-semibold text-gray-900">{office.totalAssets}</p>
        <p className="text-xs text-gray-600">Total Assets</p>
      </div>
    </div>

    <div className="space-y-2 mb-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Assigned:</span>
        <span className="font-medium text-green-600">{office.assignedAssets}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Available:</span>
        <span className="font-medium text-blue-600">{office.availableAssets}</span>
      </div>
    </div>

    <div className="flex gap-2">
      <button 
        onClick={() => onViewDetails(office)}
        className="flex-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        View Details
      </button>
      <button 
        onClick={() => onEdit(office)}
        className="flex-1 text-gray-600 hover:text-gray-800 text-sm font-medium"
      >
        Edit
      </button>
    </div>
  </div>
);

export default OfficeCard;