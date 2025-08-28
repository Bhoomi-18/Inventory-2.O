import React from 'react';

interface Activity {
  id: string;
  text: string;
  time: string;
  color: string;
}

interface RecentActivityProps {
  activities: Activity[];
  loading?: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-gray-400 text-xl">📋</span>
            </div>
            <p className="text-gray-500 text-sm">No recent activity</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`w-2 h-2 ${activity.color} rounded-full mt-2`}></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.text}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;