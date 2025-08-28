import { useState, useEffect, useCallback } from 'react';
import dashboardService, { type DashboardStats } from '../services/dashboardService';

interface UseDashboardReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refreshStats: () => void;
  quickAddAsset: (assetData: any) => Promise<void>;
  bulkUpload: (file: File) => Promise<void>;
}

export const useDashboard = (): UseDashboardReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await dashboardService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard statistics');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStats = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  const quickAddAsset = useCallback(async (assetData: any) => {
    try {
      await dashboardService.quickAddAsset(assetData);
      await fetchStats();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to add asset');
    }
  }, [fetchStats]);

  const bulkUpload = useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await dashboardService.bulkUpload(formData);
      await fetchStats();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to upload file');
    }
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats,
    quickAddAsset,
    bulkUpload
  };
};