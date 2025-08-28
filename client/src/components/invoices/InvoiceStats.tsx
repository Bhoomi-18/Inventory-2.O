import React from 'react';
import { Receipt, Clock, AlertTriangle, DollarSign } from 'lucide-react';
import StatCard from '../common/StatCard';
import { useInvoiceStats } from '../../hooks/useInvoice';
import { formatCurrency } from '../../utils';

const InvoiceStats: React.FC = () => {
  const { stats, loading, error } = useInvoiceStats();

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Failed to load invoice statistics: {error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const totalPendingAndOverdue = stats.pendingAmount + stats.overdueAmount;
  const paidPercentage = stats.totalAmount > 0 
    ? ((stats.paidThisMonth / stats.totalAmount) * 100).toFixed(1)
    : '0';

  return (
    <div className="grid grid-cols-4 gap-6">
      <StatCard
        title="Total Invoices"
        value={stats.totalInvoices.toString()}
        change={`${stats.totalInvoices} this month`}
        icon={Receipt}
        color="bg-blue-600"
      />
      <StatCard
        title="Pending Payment"
        value={formatCurrency(totalPendingAndOverdue)}
        change={`${Math.round((stats.pendingAmount + stats.overdueAmount) / (stats.totalAmount || 1) * 100)}% of total`}
        icon={Clock}
        color="bg-orange-600"
      />
      <StatCard
        title="Overdue"
        value={formatCurrency(stats.overdueAmount)}
        change={stats.overdueAmount > 0 ? 'Needs attention' : 'All current'}
        icon={AlertTriangle}
        color="bg-red-600"
      />
      <StatCard
        title="Paid This Month"
        value={formatCurrency(stats.paidThisMonth)}
        change={`${paidPercentage}% collection rate`}
        icon={DollarSign}
        color="bg-green-600"
      />
    </div>
  );
};

export default InvoiceStats;