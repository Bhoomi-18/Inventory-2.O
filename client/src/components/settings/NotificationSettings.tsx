import React, { useState } from 'react';
import { Save, Bell } from 'lucide-react';
import type { NotificationSettings } from '../../types';

interface NotificationSettingsProps {
  settings: NotificationSettings;
  onSave: (settings: NotificationSettings) => void;
}

const NotificationSettingsComponent: React.FC<NotificationSettingsProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<NotificationSettings>(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const notificationTypes = [
    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
    { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
    { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications' },
    { key: 'assignmentReminders', label: 'Assignment Reminders', description: 'Reminders for asset assignments' },
    { key: 'returnReminders', label: 'Return Reminders', description: 'Reminders for asset returns' },
    { key: 'repairUpdates', label: 'Repair Updates', description: 'Notifications about repair status' },
    { key: 'lowStockAlerts', label: 'Low Stock Alerts', description: 'Alerts when inventory is low' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5 text-blue-600" />
        <h4 className="text-lg font-medium text-gray-900">Notification Preferences</h4>
      </div>

      <div className="space-y-4">
        {notificationTypes.map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900">{label}</h5>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData[key as keyof NotificationSettings] as boolean}
                onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.checked }))}
                className="sr-only"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Notification Settings
        </button>
      </div>
    </form>
  );
};

export default NotificationSettingsComponent;