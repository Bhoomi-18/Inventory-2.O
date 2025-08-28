import React, { useState } from 'react';
import { Plus, Upload, Package, Users, Wrench, AlertTriangle, RefreshCw, AlertCircle } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import StatCard from '../common/StatCard';
import AssetDistributionChart from './AssetDistributionChart';
import AssignmentTrendsChart from './AssignmentTrendsChart';
import RecentActivity from './RecentActivity';
import AlertsNotifications from './AlertsNotifications';
import QuickAddModal from './QuickAddModal';
import BulkUploadModal from './BulkUploadModal';

const Dashboard: React.FC = () => {
  const { stats, loading, error, refreshStats, quickAddAsset, bulkUpload } = useDashboard();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const handleQuickAdd = async (assetData: any) => {
    try {
      setActionLoading(true);
      setActionError('');
      await quickAddAsset(assetData);
    } catch (err: any) {
      setActionError(err.message);
      throw err; 
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkUpload = async (file: File) => {
    try {
      setActionLoading(true);
      setActionError('');
      await bulkUpload(file);
    } catch (err: any) {
      setActionError(err.message);
      throw err; 
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-gray-600">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refreshStats}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to Empcare Asset Management</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshStats}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50"
            title="Refresh Dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowQuickAdd(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Asset
          </button>
          <button
            onClick={() => setShowBulkUpload(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Bulk Upload
          </button>
        </div>
      </div>

      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {actionError}
        </div>
      )}

      <div className="grid grid-cols-4 gap-6">
        <StatCard
          title="Total Assets"
          value={stats?.totalAssets.toLocaleString() || '0'}
          change="+12% this month"
          icon={Package}
          color="bg-blue-600"
          loading={loading}
        />
        <StatCard
          title="Assigned Items"
          value={stats?.assignedItems.toLocaleString() || '0'}
          change={stats ? `${Math.round((stats.assignedItems / stats.totalAssets) * 100)}% of total assets` : '0% of total assets'}
          icon={Users}
          color="bg-green-600"
          loading={loading}
        />
        <StatCard
          title="Under Repair"
          value={stats?.underRepair.toLocaleString() || '0'}
          change="Avg repair time: 5 days"
          icon={Wrench}
          color="bg-orange-600"
          loading={loading}
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats?.lowStockAlerts.toLocaleString() || '0'}
          change="Requires attention"
          icon={AlertTriangle}
          color="bg-red-600"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <AssetDistributionChart 
          data={stats?.assetDistribution || []} 
          loading={loading}
        />
        <AssignmentTrendsChart 
          data={stats?.assignmentTrends || []} 
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <RecentActivity 
          activities={stats?.recentActivity || []} 
          loading={loading}
        />
        <AlertsNotifications 
          alerts={stats?.alerts || []} 
          loading={loading}
        />
      </div>

      {/* Modals */}
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onSubmit={handleQuickAdd}
      />

      <BulkUploadModal
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onUpload={handleBulkUpload}
      />
    </div>
  );
};

export default Dashboard;