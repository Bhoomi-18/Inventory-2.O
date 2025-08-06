import React from 'react';
import { AlertTriangle, Clock, Wrench } from 'lucide-react';

const AlertsNotifications: React.FC = () => {
  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Critical Stock Alert',
      message: 'Network switches running low (3 remaining)',
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      messageColor: 'text-red-700',
      iconColor: 'text-red-500'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Overdue Returns',
      message: '5 items past return date',
      icon: Clock,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-900',
      messageColor: 'text-yellow-700',
      iconColor: 'text-yellow-500'
    },
    {
      id: 3,
      type: 'info',
      title: 'Repair Updates',
      message: '3 items ready for pickup',
      icon: Wrench,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900',
      messageColor: 'text-blue-700',
      iconColor: 'text-blue-500'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Notifications</h3>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className={`${alert.bgColor} border ${alert.borderColor} rounded-lg p-4`}>
            <div className="flex items-start gap-3">
              <alert.icon className={`w-5 h-5 ${alert.iconColor} mt-0.5`} />
              <div>
                <p className={`text-sm font-medium ${alert.textColor}`}>{alert.title}</p>
                <p className={`text-sm ${alert.messageColor}`}>{alert.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsNotifications;