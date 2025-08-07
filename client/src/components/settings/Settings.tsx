import React, { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import GeneralSettingsComponent from './GeneralSettings';
import SecuritySettingsComponent from './SecuritySettings';
import NotificationSettingsComponent from './NotificationSettings';
import type { SystemSettings } from '../../types';
import { sampleSettings } from '../../data/mockData';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>(sampleSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'backup' | 'integration'>('general');
  const [hasChanges, setHasChanges] = useState(false);

  const handleGeneralSave = (generalSettings: typeof settings.general) => {
    setSettings(prev => ({ ...prev, general: generalSettings }));
    setHasChanges(false);
    console.log('General settings saved');
  };

  const handleSecuritySave = (securitySettings: typeof settings.security) => {
    setSettings(prev => ({ ...prev, security: securitySettings }));
    setHasChanges(false);
    console.log('Security settings saved');
  };

  const handleNotificationSave = (notificationSettings: typeof settings.notifications) => {
    setSettings(prev => ({ ...prev, notifications: notificationSettings }));
    setHasChanges(false);
    console.log('Notification settings saved');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'security', label: 'Security', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: SettingsIcon },
    { id: 'backup', label: 'Backup', icon: SettingsIcon },
    { id: 'integration', label: 'Integration', icon: SettingsIcon }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettingsComponent settings={settings.general} onSave={handleGeneralSave} />;
      case 'security':
        return <SecuritySettingsComponent settings={settings.security} onSave={handleSecuritySave} />;
      case 'notifications':
        return <NotificationSettingsComponent settings={settings.notifications} onSave={handleNotificationSave} />;
      case 'backup':
        return (
          <div className="p-6 bg-gray-50 rounded-lg text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Backup Settings</h3>
            <p className="text-gray-600">Backup configuration panel coming soon</p>
          </div>
        );
      case 'integration':
        return (
          <div className="p-6 bg-gray-50 rounded-lg text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Integration Settings</h3>
            <p className="text-gray-600">Third-party integration panel coming soon</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure system preferences and security settings</p>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-800 rounded-lg">
            <span className="text-sm">Unsaved changes</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;