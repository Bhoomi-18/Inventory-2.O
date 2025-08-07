import React from 'react';
import { Receipt, Clock, AlertTriangle, DollarSign } from 'lucide-react';
import StatCard from '../common/StatCard';

const InvoiceStats: React.FC = () => (
  <div className="grid grid-cols-4 gap-6">
    <StatCard
      title="Total Invoices"
      value="234"
      change="+12 this month"
      icon={Receipt}
      color="bg-blue-600"
    />
    <StatCard
      title="Pending Payment"
      value="$45,230"
      change="18 invoices"
      icon={Clock}
      color="bg-orange-600"
    />
    <StatCard
      title="Overdue"
      value="$12,450"
      change="5 invoices"
      icon={AlertTriangle}
      color="bg-red-600"
    />
    <StatCard
      title="Paid This Month"
      value="$89,670"
      change="+15% from last month"
      icon={DollarSign}
      color="bg-green-600"
    />
  </div>
);

export default InvoiceStats;