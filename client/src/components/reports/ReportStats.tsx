import React from 'react';
import { FileText, Download, Clock, CheckCircle } from 'lucide-react';
import StatCard from '../common/StatCard';

const ReportStats: React.FC = () => (
  <div className="grid grid-cols-4 gap-6">
    <StatCard
      title="Total Reports"
      value="156"
      change="+15 this month"
      icon={FileText}
      color="bg-blue-600"
    />
    <StatCard
      title="Downloaded"
      value="89"
      change="57% success rate"
      icon={Download}
      color="bg-green-600"
    />
    <StatCard
      title="In Progress"
      value="3"
      change="Avg time: 2 mins"
      icon={Clock}
      color="bg-orange-600"
    />
    <StatCard
      title="Scheduled Reports"
      value="12"
      change="Auto-generated"
      icon={CheckCircle}
      color="bg-purple-600"
    />
  </div>
);

export default ReportStats;