import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { ChartData } from '../../types';

interface AssetDistributionChartProps {
  data: ChartData[];
}

const AssetDistributionChart: React.FC<AssetDistributionChartProps> = ({ data }) => (
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
          <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
          <span className="text-sm text-gray-600">{item.name}</span>
        </div>
      ))}
    </div>
  </div>
);

export default AssetDistributionChart;