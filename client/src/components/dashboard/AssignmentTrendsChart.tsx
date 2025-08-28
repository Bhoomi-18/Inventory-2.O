import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface TrendData {
  month: string;
  newAssignments: number;
  returns: number;
}

interface AssignmentTrendsChartProps {
  data: TrendData[];
  loading?: boolean;
}

const AssignmentTrendsChart: React.FC<AssignmentTrendsChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Assignment Trends</h3>
        <div className="h-64">
          <div className="w-full h-full bg-gray-100 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Assignment Trends</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-2xl">📈</span>
            </div>
            <p className="text-gray-500">No trend data available</p>
          </div>
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
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Assignment Trends</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="newAssignments" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="New Assignments"
            />
            <Line 
              type="monotone" 
              dataKey="returns" 
              stroke="#10b981" 
              strokeWidth={3}
              name="Returns"
            />
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
};

export default AssignmentTrendsChart;