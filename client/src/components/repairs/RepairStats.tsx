import React from 'react';
import { Wrench, CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';
import StatCard from '../common/StatCard';
import type { RepairStats } from '../../types/repair';

interface RepairStatsProps {
  stats: RepairStats | null;
  loading: boolean;
}

const RepairStatsComponent: React.FC<RepairStatsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-4 gap-6">
        <StatCard title="Under Repair" value="0" icon={Wrench} color="bg-orange-600" />
        <StatCard title="Repair Complete" value="0" icon={CheckCircle} color="bg-green-600" />
        <StatCard title="Awaiting Parts" value="0" icon={Clock} color="bg-blue-600" />
        <StatCard title="Total Cost" value="$0" icon={DollarSign} color="bg-gray-600" />
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDays = (days: number) => {
    if (days === 0) return 'N/A';
    return days === 1 ? '1 day' : `${days} days`;
  };

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard 
          title="Under Repair" 
          value={stats.underRepair.toString()} 
          icon={Wrench} 
          color="bg-orange-600"
          subtitle={stats.underRepair > 0 ? "Active tickets" : "No active repairs"}
        />
        <StatCard 
          title="Repair Complete" 
          value={stats.complete.toString()} 
          icon={CheckCircle} 
          color="bg-green-600"
          subtitle="This period"
        />
        <StatCard 
          title="Awaiting Parts" 
          value={stats.awaitingParts.toString()} 
          icon={Clock} 
          color="bg-blue-600"
          subtitle={stats.awaitingParts > 0 ? "Pending delivery" : "All parts available"}
        />
        <StatCard 
          title="Total Cost" 
          value={formatCurrency(stats.totalCost)} 
          icon={DollarSign} 
          color="bg-gray-600"
          subtitle="All repairs"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Avg Repair Time</h3>
              <p className="text-2xl font-bold text-gray-900">{formatDays(stats.avgRepairTime)}</p>
            </div>
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Priority Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(stats.priorityBreakdown).map(([priority, count]) => (
              <div key={priority} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{priority}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  priority === 'Critical' ? 'bg-red-100 text-red-800' :
                  priority === 'High' ? 'bg-orange-100 text-orange-800' :
                  priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
              View overdue repairs
            </button>
            <button className="w-full text-left text-sm text-green-600 hover:text-green-800 hover:bg-green-50 px-2 py-1 rounded transition-colors">
              Export repair report
            </button>
            <button className="w-full text-left text-sm text-orange-600 hover:text-orange-800 hover:bg-orange-50 px-2 py-1 rounded transition-colors">
              Schedule maintenance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairStatsComponent;