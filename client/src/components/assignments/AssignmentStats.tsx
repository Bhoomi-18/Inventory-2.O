import React from 'react';
import { Users, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import StatCard from '../common/StatCard';

const AssignmentStats: React.FC = () => (
  <div className="grid grid-cols-4 gap-6">
    <StatCard title="Active Assignments" value="1,456" icon={Users} color="bg-green-600" />
    <StatCard title="Pending Returns" value="23" icon={Clock} color="bg-orange-600" />
    <StatCard title="Overdue Returns" value="5" icon={AlertTriangle} color="bg-red-600" />
    <StatCard title="This Month" value="247" icon={TrendingUp} color="bg-blue-600" />
  </div>
);

export default AssignmentStats;