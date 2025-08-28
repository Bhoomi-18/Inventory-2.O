import { useState, useEffect } from 'react';
import repairService from '../services/repairService';
import type { RepairTicket, RepairStats, RepairRequest, RepairQuery } from '../types/repair';

interface UseRepairsResult {
  repairs: RepairTicket[];
  stats: RepairStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  fetchRepairs: (params?: RepairQuery) => Promise<void>;
  fetchStats: () => Promise<void>;
  createRepair: (data: RepairRequest) => Promise<RepairTicket>;
  updateRepair: (id: string, data: Partial<RepairRequest>) => Promise<RepairTicket>;
  deleteRepair: (id: string) => Promise<void>;
  completeRepair: (id: string, data: { cost?: number; notes?: string }) => Promise<RepairTicket>;
  refresh: () => Promise<void>;
}

export const useRepairs = (initialQuery?: RepairQuery): UseRepairsResult => {
  const [repairs, setRepairs] = useState<RepairTicket[]>([]);
  const [stats, setStats] = useState<RepairStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseRepairsResult['pagination']>(null);
  const [currentQuery, setCurrentQuery] = useState<RepairQuery | undefined>(initialQuery);

  const fetchRepairs = async (params?: RepairQuery) => {
    try {
      setLoading(true);
      setError(null);
      const query = params || currentQuery;
      setCurrentQuery(query);
      
      const response = await repairService.getRepairs(query);
      setRepairs(response.repairs);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch repairs');
      setRepairs([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await repairService.getRepairStats();
      setStats(statsData);
    } catch (err: any) {
      console.error('Failed to fetch repair stats:', err);
    }
  };

  const createRepair = async (data: RepairRequest): Promise<RepairTicket> => {
    try {
      setError(null);
      const newRepair = await repairService.createRepair(data);
      await refresh();
      return newRepair;
    } catch (err: any) {
      setError(err.message || 'Failed to create repair');
      throw err;
    }
  };

  const updateRepair = async (id: string, data: Partial<RepairRequest>): Promise<RepairTicket> => {
    try {
      setError(null);
      const updatedRepair = await repairService.updateRepair(id, data);
      
      setRepairs(prev => prev.map(repair => 
        repair.id === id ? { ...repair, ...updatedRepair } : repair
      ));
      
      await fetchStats(); 
      return updatedRepair;
    } catch (err: any) {
      setError(err.message || 'Failed to update repair');
      throw err;
    }
  };

  const deleteRepair = async (id: string): Promise<void> => {
    try {
      setError(null);
      await repairService.deleteRepair(id);
      
      setRepairs(prev => prev.filter(repair => repair.id !== id));
      await fetchStats(); 
    } catch (err: any) {
      setError(err.message || 'Failed to delete repair');
      throw err;
    }
  };

  const completeRepair = async (id: string, data: { cost?: number; notes?: string }): Promise<RepairTicket> => {
    try {
      setError(null);
      const completedRepair = await repairService.completeRepair(id, data);
      
      setRepairs(prev => prev.map(repair => 
        repair.id === id ? { ...repair, ...completedRepair } : repair
      ));
      
      await fetchStats(); 
      return completedRepair;
    } catch (err: any) {
      setError(err.message || 'Failed to complete repair');
      throw err;
    }
  };

  const refresh = async () => {
    await Promise.all([
      fetchRepairs(currentQuery),
      fetchStats()
    ]);
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    repairs,
    stats,
    loading,
    error,
    pagination,
    fetchRepairs,
    fetchStats,
    createRepair,
    updateRepair,
    deleteRepair,
    completeRepair,
    refresh
  };
};

interface UseSingleRepairResult {
  repair: RepairTicket | null;
  loading: boolean;
  error: string | null;
  fetchRepair: (id: string) => Promise<void>;
  updateRepair: (data: Partial<RepairRequest>) => Promise<RepairTicket>;
  completeRepair: (data: { cost?: number; notes?: string }) => Promise<RepairTicket>;
}

export const useSingleRepair = (id?: string): UseSingleRepairResult => {
  const [repair, setRepair] = useState<RepairTicket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepair = async (repairId: string) => {
    try {
      setLoading(true);
      setError(null);
      const repairData = await repairService.getRepair(repairId);
      setRepair(repairData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch repair');
      setRepair(null);
    } finally {
      setLoading(false);
    }
  };

  const updateRepair = async (data: Partial<RepairRequest>): Promise<RepairTicket> => {
    if (!repair) throw new Error('No repair loaded');
    
    try {
      setError(null);
      const updatedRepair = await repairService.updateRepair(repair.id, data);
      setRepair(updatedRepair);
      return updatedRepair;
    } catch (err: any) {
      setError(err.message || 'Failed to update repair');
      throw err;
    }
  };

  const completeRepair = async (data: { cost?: number; notes?: string }): Promise<RepairTicket> => {
    if (!repair) throw new Error('No repair loaded');
    
    try {
      setError(null);
      const completedRepair = await repairService.completeRepair(repair.id, data);
      setRepair(completedRepair);
      return completedRepair;
    } catch (err: any) {
      setError(err.message || 'Failed to complete repair');
      throw err;
    }
  };

  useEffect(() => {
    if (id) {
      fetchRepair(id);
    }
  }, [id]);

  return {
    repair,
    loading,
    error,
    fetchRepair,
    updateRepair,
    completeRepair
  };
};