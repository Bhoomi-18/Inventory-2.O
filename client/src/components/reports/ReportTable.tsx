import React from 'react';
import { FileText, Download, Calendar, User, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Report } from '../../types/report';

interface ReportTableProps {
  reports: Report[];
  loading: boolean;
  filters: {
    search: string;
    type: string;
    status: string;
    page: number;
  };
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  } | null;
  onDownload: (report: Report) => Promise<void>;
  onDelete: (reportId: string) => Promise<void>;
  onFilterChange: (key: string, value: string) => void;
  onPageChange: (page: number) => void;
}

const ReportTable: React.FC<ReportTableProps> = ({ 
  reports, 
  loading, 
  filters,
  pagination,
  onDownload, 
  onDelete,
  onFilterChange,
  onPageChange
}) => {
  const reportTypes = [
    'Asset Utilization',
    'Assignment History',
    'Repair Analytics',
    'Vendor Performance',
    'Cost Analysis',
    'Custom'
  ];

  const statusOptions = [
    'Generated',
    'Generating',
    'Failed'
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Generated':
        return 'bg-green-100 text-green-800';
      case 'Generating':
        return 'bg-orange-100 text-orange-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderPagination = () => {
    if (!pagination || pagination.pages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
        <div className="text-sm text-gray-700">
          Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
          {pagination.total} reports
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="p-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            let pageNum;
            if (pagination.pages <= 5) {
              pageNum = i + 1;
            } else if (pagination.page <= 3) {
              pageNum = i + 1;
            } else if (pagination.page >= pagination.pages - 2) {
              pageNum = pagination.pages - 4 + i;
            } else {
              pageNum = pagination.page - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pageNum === pagination.page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="p-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Generated Reports</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search reports..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select 
              value={filters.type}
              onChange={(e) => onFilterChange('type', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {reportTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select 
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading reports...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-500">
              {filters.search || filters.type || filters.status 
                ? "Try adjusting your filters or search terms"
                : "Generate your first report to get started"
              }
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-900">REPORT NAME</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900">TYPE</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900">GENERATED BY</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900">DATE</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900">STATUS</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900">SIZE</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">{report.name}</p>
                        {report.description && (
                          <p className="text-sm text-gray-500">{report.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {report.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{report.generatedBy}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {formatDate(report.dateGenerated)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {report.status === 'Generating' && (
                        <Loader2 className="w-3 h-3 animate-spin text-orange-600" />
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-900">{report.fileSize || '-'}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {report.status === 'Generated' && (
                        <button 
                          onClick={() => onDownload(report)}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 hover:underline"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                      )}
                      <button 
                        onClick={() => onDelete(report.id)}
                        className="text-red-600 hover:text-red-800 text-sm hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {renderPagination()}
    </div>
  );
};

export default ReportTable;