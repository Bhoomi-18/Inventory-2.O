import React, { useState } from 'react';
import { FileText, Download, X } from 'lucide-react';

interface ReportGeneratorProps {
  onGenerate: (reportConfig: ReportConfig) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

interface ReportConfig {
  type: string;
  name: string;
  description: string;
  format: string;
  dateRange: {
    start: string;
    end: string;
  };
  filters: {
    office?: string;
    department?: string;
    category?: string;
  };
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ onGenerate, onCancel, loading }) => {
  const [config, setConfig] = useState<ReportConfig>({
    type: '',
    name: '',
    description: '',
    format: 'PDF',
    dateRange: {
      start: '',
      end: ''
    },
    filters: {}
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!config.type) {
      newErrors.type = 'Report type is required';
    }

    if (!config.name.trim()) {
      newErrors.name = 'Report name is required';
    }

    if (!config.dateRange.start) {
      newErrors.startDate = 'Start date is required';
    }

    if (!config.dateRange.end) {
      newErrors.endDate = 'End date is required';
    }

    if (config.dateRange.start && config.dateRange.end) {
      if (new Date(config.dateRange.end) <= new Date(config.dateRange.start)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onGenerate(config);
    } catch (error) {
    }
  };

  const reportTypes = [
    'Asset Utilization',
    'Assignment History',
    'Repair Analytics',
    'Vendor Performance',
    'Cost Analysis',
    'Custom'
  ];

  const categories = [
    'Computers & Laptops',
    'Monitors & Displays',
    'Mobile Devices',
    'Network Equipment',
    'Office Equipment',
    'Other'
  ];

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Generate New Report</h3>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type *
            </label>
            <select
              value={config.type}
              onChange={(e) => setConfig(prev => ({ ...prev, type: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.type ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Select Report Type</option>
              {reportTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select
              value={config.format}
              onChange={(e) => setConfig(prev => ({ ...prev, format: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PDF">PDF</option>
              <option value="Excel">Excel</option>
              <option value="CSV">CSV</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Report Name *
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter report name"
            required
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={config.description}
            onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter report description (optional)"
            maxLength={500}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              value={config.dateRange.start}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                dateRange: { ...prev.dateRange, start: e.target.value }
              }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.startDate ? 'border-red-300' : 'border-gray-300'
              }`}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <input
              type="date"
              value={config.dateRange.end}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                dateRange: { ...prev.dateRange, end: e.target.value }
              }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.endDate ? 'border-red-300' : 'border-gray-300'
              }`}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
          </div>
        </div>

        {/* Filters Section */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Filters (Optional)</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Category</label>
              <select
                value={config.filters.category || ''}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  filters: { ...prev.filters, category: e.target.value || undefined }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Office</label>
              <input
                type="text"
                value={config.filters.office || ''}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  filters: { ...prev.filters, office: e.target.value || undefined }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Filter by office"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Department</label>
              <input
                type="text"
                value={config.filters.department || ''}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  filters: { ...prev.filters, department: e.target.value || undefined }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Filter by department"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportGenerator;