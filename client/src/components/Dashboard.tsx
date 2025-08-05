// client/src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth, apiCall } from '../App';
import { 
  Package, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Wrench,
  TrendingUp
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalAssets: number;
  availableAssets: number;
  assignedAssets: number;
  maintenanceAssets: number;
  activeAssignments: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.role === 'admin' || user?.role === 'manager') {
          const data = await apiCall('/users/dashboard-stats');
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Assets',
      stat: stats?.totalAssets || 0,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: 'Available',
      stat: stats?.availableAssets || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: 'Assigned',
      stat: stats?.assignedAssets || 0,
      icon: Users,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      name: 'Maintenance',
      stat: stats?.maintenanceAssets || 0,
      icon: Wrench,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {user?.name}! Here's what's happening with your inventory.
        </p>
      </div>

      {/* Stats Overview - Only for Admin/Manager */}
      {(user?.role === 'admin' || user?.role === 'manager') && stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((item) => (
            <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${item.bgColor}`}>
                      <item.icon className={`h-6 w-6 ${item.textColor}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {item.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {item.stat}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickActionCard
              title="View Inventory"
              description="Browse all assets in the system"
              href="/inventory"
              icon={Package}
              color="blue"
            />
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <>
                <QuickActionCard
                  title="Add New Asset"
                  description="Register a new asset in inventory"
                  href="/inventory/new"
                  icon={TrendingUp}
                  color="green"
                />
                <QuickActionCard
                  title="Manage Users"
                  description="Add or manage system users"
                  href="/users"
                  icon={Users}
                  color="purple"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity - Placeholder for future enhancement */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            System Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Your Role</span>
              <span className="text-sm font-medium text-gray-900 capitalize">{user?.role}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Department</span>
              <span className="text-sm font-medium text-gray-900">{user?.department}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Email</span>
              <span className="text-sm font-medium text-gray-900">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickActionCard = ({ 
  title, 
  description, 
  href, 
  icon: Icon, 
  color 
}: {
  title: string;
  description: string;
  href: string;
  icon: any;
  color: string;
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
  };

  return (
    <a
      href={href}
      className="relative block p-4 border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 p-2 rounded-md ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </a>
  );
};

export default Dashboard;