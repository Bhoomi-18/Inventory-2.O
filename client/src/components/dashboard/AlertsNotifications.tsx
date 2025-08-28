import React from 'react';
import { AlertTriangle, Clock, Wrench, CheckCircle } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
}

interface AlertsNotificationsProps {
  alerts: Alert[];
  loading?: boolean;
}

const AlertsNotifications: React.FC<AlertsNotificationsProps> = ({ alerts, loading = false }) => {
  const getAlertConfig = (type: string) => {
    switch (type) {
      case 'critical':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-900',
          messageColor: 'text-red-700',
          iconColor: 'text-red-500'
        };
      case 'warning':
        return {
          icon: Clock,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-900',
          messageColor: 'text-yellow-700',
          iconColor: 'text-yellow-500'
        };
      case 'info':
      default:
        return {
          icon: Wrench,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-900',
          messageColor: 'text-blue-700',
          iconColor: 'text-blue-500'
        };
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Notifications</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-gray-300 rounded animate-pulse mt-0.5"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Notifications</h3>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">All good! No alerts at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Alerts & Notifications
        {alerts.length > 0 && (
          <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-red-600 bg-red-100 rounded-full">
            {alerts.length}
          </span>
        )}
      </h3>
      <div className="space-y-4">
        {alerts.map((alert) => {
          const config = getAlertConfig(alert.type);
          const IconComponent = config.icon;
          
          return (
            <div key={alert.id} className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4`}>
              <div className="flex items-start gap-3">
                <IconComponent className={`w-5 h-5 ${config.iconColor} mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${config.textColor}`}>{alert.title}</p>
                  <p className={`text-sm ${config.messageColor} mt-1`}>{alert.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsNotifications;