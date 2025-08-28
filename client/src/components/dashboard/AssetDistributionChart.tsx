import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface AssetDistributionChartProps {
  data: ChartData[];
  loading?: boolean;
}

const AssetDistributionChart: React.FC<AssetDistributionChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Distribution by Category</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Distribution by Category</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-2xl">📊</span>
            </div>
            <p className="text-gray-500">No asset data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Distribution by Category</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-4 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-gray-600">{item.name} ({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetDistributionChart;