import React from 'react';
import { FileText, Download, Clock, CheckCircle } from 'lucide-react';
import StatCard from '../common/StatCard';

interface ReportStatsProps {
  stats: {
    totalReports: number;
    generated: number;
    generating: number;
    failed: number;
    thisMonthCount: number;
    successRate: number;
  } | null;
}

const ReportStats: React.FC<ReportStatsProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      <StatCard
        title="Total Reports"
        value={stats.totalReports.toString()}
        change={`+${stats.thisMonthCount} this month`}
        icon={FileText}
        color="bg-blue-600"
      />
      <StatCard
        title="Downloaded"
        value={stats.generated.toString()}
        change={`${stats.successRate}% success rate`}
        icon={Download}
        color="bg-green-600"
      />
      <StatCard
        title="In Progress"
        value={stats.generating.toString()}
        change="Processing..."
        icon={Clock}
        color="bg-orange-600"
      />
      <StatCard
        title="Failed Reports"
        value={stats.failed.toString()}
        change="Require attention"
        icon={CheckCircle}
        color="bg-red-600"
      />
    </div>
  );
};

export default ReportStats;