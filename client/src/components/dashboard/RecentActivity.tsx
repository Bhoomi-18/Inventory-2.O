import React from 'react';

const RecentActivity: React.FC = () => {
  const activities = [
    { id: 1, text: 'MacBook Pro assigned to Sarah Chen', time: '15 minutes ago', color: 'bg-green-500' },
    { id: 2, text: '50 new Dell monitors added to inventory', time: '2 hours ago', color: 'bg-blue-500' },
    { id: 3, text: 'iPhone 14 sent for repair - screen damage', time: '4 hours ago', color: 'bg-orange-500' },
    { id: 4, text: 'New vendor "TechSupply Pro" added', time: '1 day ago', color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3">
            <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
            <div>
              <p className="text-sm font-medium text-gray-900">{activity.text}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;