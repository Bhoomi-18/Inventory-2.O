import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import OfficeList from './OfficeList';
import type { Office } from '../../types';
import { sampleOffices } from '../../data/mockData';

const Offices: React.FC = () => {
  const [offices, setOffices] = useState<Office[]>(sampleOffices);

  const handleViewDetails = (office: Office) => {
    console.log('Viewing office details:', office.name);
  };

  const handleEdit = (office: Office) => {
    console.log('Editing office:', office.name);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Office Management</h1>
          <p className="text-gray-600">Manage office locations and configurations</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add Office
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Office Locations</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search offices..."
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <OfficeList 
          offices={offices}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
};

export default Offices;