import React from 'react';
import { Wrench } from 'lucide-react';
import RepairStats from './RepairStats';
import RepairTable from './RepairTable';
import { sampleRepairTickets } from '../../data/mockData';

const Repairs: React.FC = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Repair Management</h1>
        <p className="text-gray-600">Track asset repairs and maintenance</p>
      </div>
      <button className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700">
        <Wrench className="w-4 h-4" />
        Report Issue
      </button>
    </div>

    <RepairStats />
    <RepairTable tickets={sampleRepairTickets} />
  </div>
);

export default Repairs;