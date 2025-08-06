import React from 'react';
import { Users } from 'lucide-react';
import AssignmentStats from './AssignmentStats';
import AssignmentTable from './AssignmentTable';
import { sampleAssignments } from '../../data/mockData';

const Assignments: React.FC = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assignment Management</h1>
        <p className="text-gray-600">Track asset assignments and returns</p>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
        <Users className="w-4 h-4" />
        New Assignment
      </button>
    </div>

    <AssignmentStats />
    <AssignmentTable assignments={sampleAssignments} />
  </div>
);

export default Assignments;