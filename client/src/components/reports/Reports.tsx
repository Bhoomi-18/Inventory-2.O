import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ReportStats from './ReportStats';
import ReportTable from './ReportTable';
import ReportGenerator from './ReportGenerator';
import type { Report } from '../../types';
import { sampleReports } from '../../data/mockData';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>(sampleReports);
  const [showGenerator, setShowGenerator] = useState(false);

  const handleGenerate = (config: any) => {
    const newReport: Report = {
      id: String(reports.length + 1),
      name: config.name,
      type: config.type,
      description: config.description,
      generatedBy: 'Current User',
      dateGenerated: new Date().toISOString().split('T')[0],
      format: config.format,
      status: 'Generating'
    };

    setReports(prev => [newReport, ...prev]);
    setShowGenerator(false);

    // Simulate report generation
    setTimeout(() => {
      setReports(prev => prev.map(report => 
        report.id === newReport.id 
          ? { ...report, status: 'Generated', fileSize: '1.2 MB' }
          : report
      ));
    }, 3000);
  };

  const handleDownload = (report: Report) => {
    console.log('Downloading report:', report.name);
    // Implement download logic
  };

  const handleDelete = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      <ReportStats />

      {showGenerator && (
        <ReportGenerator onGenerate={handleGenerate} />
      )}

      <ReportTable 
        reports={reports}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Reports;