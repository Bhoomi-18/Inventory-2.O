import React from 'react';
import { Users, Shield, Clock, UserCheck } from 'lucide-react';
import StatCard from '../common/StatCard';

const UserStats: React.FC = () => (
  <div className="grid grid-cols-4 gap-6">
    <StatCard
      title="Total Users"
      value="156"
      change="+8 this month"
      icon={Users}
      color="bg-blue-600"
    />
    <StatCard
      title="Active Users"
      value="142"
      change="91% active rate"
      icon={UserCheck}
      color="bg-green-600"
    />
    <StatCard
      title="Roles Created"
      value="12"
      change="3 custom roles"
      icon={Shield}
      color="bg-purple-600"
    />
    <StatCard
      title="Pending Access"
      value="3"
      change="Awaiting approval"
      icon={Clock}
      color="bg-orange-600"
    />
  </div>
);

export default UserStats;