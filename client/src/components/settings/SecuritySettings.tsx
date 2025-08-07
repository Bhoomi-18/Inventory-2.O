import React, { useState } from 'react';
import { Save, Shield } from 'lucide-react';
import type { SecuritySettings } from '../../types';

interface SecuritySettingsProps {
  settings: SecuritySettings;
  onSave: (settings: SecuritySettings) => void;
}

const SecuritySettingsComponent: React.FC<SecuritySettingsProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<SecuritySettings>(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h4 className="text-lg font-medium text-gray-900">Password Policy</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Length</label>
            <input
              type="number"
              value={formData.passwordPolicy.minLength}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                passwordPolicy: { ...prev.passwordPolicy, minLength: parseInt(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="6"
              max="20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiration (days)</label>
            <input
              type="number"
              value={formData.passwordPolicy.expirationDays}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                passwordPolicy: { ...prev.passwordPolicy, expirationDays: parseInt(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="30"
            />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.passwordPolicy.requireUppercase}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                passwordPolicy: { ...prev.passwordPolicy, requireUppercase: e.target.checked }
              }))}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Require uppercase letters</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.passwordPolicy.requireNumbers}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                passwordPolicy: { ...prev.passwordPolicy, requireNumbers: e.target.checked }
              }))}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Require numbers</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.passwordPolicy.requireSpecialChars}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                passwordPolicy: { ...prev.passwordPolicy, requireSpecialChars: e.target.checked }
              }))}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Require special characters</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={formData.twoFactorAuth}
              onChange={(e) => setFormData(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">Enable Two-Factor Authentication</span>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={formData.auditLogs}
              onChange={(e) => setFormData(prev => ({ ...prev, auditLogs: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">Enable Audit Logs</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            value={formData.sessionTimeout}
            onChange={(e) => setFormData(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
          <input
            type="number"
            value={formData.maxLoginAttempts}
            onChange={(e) => setFormData(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="3"
            max="10"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Security Settings
        </button>
      </div>
    </form>
  );
};

export default SecuritySettingsComponent;