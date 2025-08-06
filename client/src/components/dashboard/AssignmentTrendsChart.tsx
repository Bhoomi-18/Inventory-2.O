import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { TrendData } from '../../types';

interface AssignmentTrendsChartProps {
  data: TrendData[];
}

const AssignmentTrendsChart: React.FC<AssignmentTrendsChartProps> = ({ data }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Assignment Trends</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="newAssignments" stroke="#3b82f6" strokeWidth={3} />
          <Line type="monotone" dataKey="returns" stroke="#10b981" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="flex gap-4 mt-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        <span className="text-sm text-gray-600">New Assignments</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-sm text-gray-600">Returns</span>
      </div>
    </div>
  </div>
);

export default AssignmentTrendsChart;