import { useState, useEffect, useCallback } from 'react';
import reportService from '../services/reportService';
import type { Report } from '../types/report';

interface ReportStats {
  totalReports: number;
  generated: number;
  generating: number;
  failed: number;
  thisMonthCount: number;
  successRate: number;
}

interface UseReportResult {
  reports: Report[];
  stats: ReportStats | null;
  
  loading: boolean;
  statsLoading: boolean;
  generateLoading: boolean;
  
  error: string | null;
  
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  } | null;
  
  fetchReports: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    search?: string;
  }) => Promise<void>;
  fetchStats: () => Promise<void>;
  generateReport: (config: any) => Promise<Report>;
  downloadReport: (reportId: string) => Promise<void>;
  deleteReport: (reportId: string) => Promise<void>;
  
  refreshData: () => Promise<void>;
}

export const useReport = (): UseReportResult => {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    pages: number;
    limit: number;
  } | null>(null);

  const fetchReports = useCallback(async (params: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    search?: string;
  } = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await reportService.getReports(params);
      setReports(data.reports);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const statsData = await reportService.getReportStats();
      setStats(statsData);
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const generateReport = useCallback(async (config: any): Promise<Report> => {
    try {
      setGenerateLoading(true);
      setError(null);
      
      const newReport = await reportService.generateReport(config);
      
      setReports(prev => [newReport, ...prev]);
      
      fetchStats();
      
      return newReport;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setGenerateLoading(false);
    }
  }, [fetchStats]);

  const downloadReport = useCallback(async (reportId: string) => {
    try {
      await reportService.downloadReport(reportId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteReport = useCallback(async (reportId: string) => {
    try {
      await reportService.deleteReport(reportId);
      
      setReports(prev => prev.filter(report => report.id !== reportId));
      
      fetchStats();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [fetchStats]);

  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchReports(),
      fetchStats()
    ]);
  }, [fetchReports, fetchStats]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    const hasGeneratingReports = reports.some(report => report.status === 'Generating');
    
    if (hasGeneratingReports) {
      const interval = setInterval(() => {
        fetchReports();
      }, 5000); 
      
      return () => clearInterval(interval);
    }
  }, [reports, fetchReports]);

  return {
    reports,
    stats,
    loading,
    statsLoading,
    generateLoading,
    error,
    pagination,
    fetchReports,
    fetchStats,
    generateReport,
    downloadReport,
    deleteReport,
    refreshData
  };
};