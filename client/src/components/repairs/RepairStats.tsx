import React from 'react';
import { Wrench, CheckCircle, Clock, DollarSign } from 'lucide-react';
import StatCard from '../common/StatCard';

const RepairStats: React.FC = () => (
  <div className="grid grid-cols-4 gap-6">
    <StatCard title="Under Repair" value="47" icon={Wrench} color="bg-orange-600" />
    <StatCard title="Repair Complete" value="12" icon={CheckCircle} color="bg-green-600" />
    <StatCard title="Awaiting Parts" value="8" icon={Clock} color="bg-blue-600" />
    <StatCard title="Total Cost" value="$24,567" icon={DollarSign} color="bg-gray-600" />
  </div>
);

export default RepairStats;