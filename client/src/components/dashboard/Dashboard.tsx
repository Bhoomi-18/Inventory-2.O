import React from 'react';
import { Plus, Upload, Package, Users, Wrench, AlertTriangle } from 'lucide-react';
import StatCard from '../common/StatCard';
import AssetDistributionChart from './AssetDistributionChart';
import AssignmentTrendsChart from './AssignmentTrendsChart';
import RecentActivity from './RecentActivity';
import AlertsNotifications from './AlertsNotifications';
import { assetDistributionData, assignmentTrendsData } from '../../data/mockData';

const Dashboard: React.FC = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to Empcare Asset Management</p>
      </div>
      <div className="flex gap-3">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add Asset
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
          <Upload className="w-4 h-4" />
          Bulk Upload
        </button>
      </div>
    </div>

    <div className="grid grid-cols-4 gap-6">
      <StatCard
        title="Total Assets"
        value="2,847"
        change="+12% this month"
        icon={Package}
        color="bg-blue-600"
      />
      <StatCard
        title="Assigned Items"
        value="1,456"
        change="51% of total assets"
        icon={Users}
        color="bg-green-600"
      />
      <StatCard
        title="Under Repair"
        value="47"
        change="Avg repair time: 5 days"
        icon={Wrench}
        color="bg-orange-600"
      />
      <StatCard
        title="Low Stock Alerts"
        value="23"
        change="Requires attention"
        icon={AlertTriangle}
        color="bg-red-600"
      />
    </div>

    <div className="grid grid-cols-2 gap-6">
      <AssetDistributionChart data={assetDistributionData} />
      <AssignmentTrendsChart data={assignmentTrendsData} />
    </div>

    <div className="grid grid-cols-2 gap-6">
      <RecentActivity />
      <AlertsNotifications />
    </div>
  </div>
);

export default Dashboard;