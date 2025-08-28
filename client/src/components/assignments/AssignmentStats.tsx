import React from 'react';
import { Users, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import StatCard from '../common/StatCard';
import { type AssignmentStats as StatsType } from '../../services/assignmentService';

interface AssignmentStatsProps {
  stats: StatsType;
  loading?: boolean;
}

const AssignmentStats: React.FC<AssignmentStatsProps> = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      <StatCard 
        title="Active Assignments" 
        value={stats.activeAssignments.toLocaleString()} 
        icon={Users} 
        color="bg-green-600" 
      />
      <StatCard 
        title="Pending Returns" 
        value={stats.pendingReturns.toLocaleString()} 
        icon={Clock} 
        color="bg-orange-600" 
      />
      <StatCard 
        title="Overdue Returns" 
        value={stats.overdueReturns.toLocaleString()} 
        icon={AlertTriangle} 
        color="bg-red-600" 
      />
      <StatCard 
        title="This Month" 
        value={stats.thisMonth.toLocaleString()} 
        icon={TrendingUp} 
        color="bg-blue-600" 
      />
    </div>
  );
};

export default AssignmentStats;