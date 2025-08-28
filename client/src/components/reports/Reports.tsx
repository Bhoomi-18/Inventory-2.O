import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import ReportStats from './ReportStats';
import ReportTable from './ReportTable';
import ReportGenerator from './ReportGenerator';
import { useReport } from '../../hooks/useReport';
import type { Report } from '../../types/report';

const Reports: React.FC = () => {
  const {
    reports,
    stats,
    loading,
    generateLoading,
    error,
    pagination,
    fetchReports,
    generateReport,
    downloadReport,
    deleteReport
  } = useReport();

  const [showGenerator, setShowGenerator] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    page: 1
  });

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchReports({
        page: filters.page,
        limit: 10,
        type: filters.type || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined
      });
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filters, fetchReports]);

  const handleGenerate = async (config: any) => {
    try {
      await generateReport(config);
      setShowGenerator(false);
    } catch (error: any) {
      console.error('Report generation failed:', error);
    }
  };

  const handleDownload = async (report: Report) => {
    try {
      await downloadReport(report.id);
    } catch (error: any) {
      console.error('Download failed:', error);
    }
  };

  const handleDelete = async (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(reportId);
      } catch (error: any) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and manage system reports</p>
        </div>
        <button 
          onClick={() => setShowGenerator(!showGenerator)}
          disabled={generateLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {generateLoading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <ReportStats stats={stats} />

      {showGenerator && (
        <ReportGenerator 
          onGenerate={handleGenerate}
          onCancel={() => setShowGenerator(false)}
          loading={generateLoading}
        />
      )}

      <ReportTable 
        reports={reports}
        loading={loading}
        filters={filters}
        pagination={pagination}
        onDownload={handleDownload}
        onDelete={handleDelete}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Reports;