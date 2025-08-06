import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { StatCardProps } from '../../types';

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change && (
          <p className="text-sm text-green-600 mt-1">
            <TrendingUp className="inline w-3 h-3 mr-1" />
            {change}
          </p>
        )}
      </div>
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default StatCard;