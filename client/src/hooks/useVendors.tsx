import { useState, useEffect, useCallback } from 'react';
import vendorService, { 
  type VendorFilters, 
  type VendorResponse, 
  type CreateVendorData, 
  type UpdateVendorData,
  type VendorStats 
} from '../services/vendorService';
import type { Vendor } from '../types/vendor';

interface UseVendorsReturn {
  vendors: Vendor[];
  pagination: VendorResponse['pagination'] | null;
  loading: boolean;
  error: string | null;
  stats: VendorStats | null;
  statsLoading: boolean;
  loadVendors: (filters?: VendorFilters) => Promise<void>;
  createVendor: (data: CreateVendorData) => Promise<boolean>;
  updateVendor: (id: string, data: UpdateVendorData) => Promise<boolean>;
  deleteVendor: (id: string) => Promise<boolean>;
  loadStats: () => Promise<void>;
  clearError: () => void;
}

export const useVendors = (): UseVendorsReturn => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [pagination, setPagination] = useState<VendorResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadVendors = useCallback(async (filters: VendorFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await vendorService.getVendors(filters);
      
      if (response.success && response.data) {
        setVendors(response.data.vendors);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.message || 'Failed to load vendors');
      }
    } catch (err: any) {
      console.error('Load vendors error:', err);
      setError(err.message || 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  }, []);

  const createVendor = useCallback(async (data: CreateVendorData): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await vendorService.createVendor(data);
      
      if (response.success) {
        await loadVendors();
        return true;
      } else {
        throw new Error(response.message || 'Failed to create vendor');
      }
    } catch (err: any) {
      console.error('Create vendor error:', err);
      setError(err.message || 'Failed to create vendor');
      return false;
    }
  }, [loadVendors]);

  const updateVendor = useCallback(async (id: string, data: UpdateVendorData): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await vendorService.updateVendor(id, data);
      
      if (response.success) {
        setVendors(prev => prev.map(vendor => 
          vendor.id === id ? { ...vendor, ...data } : vendor
        ));
        return true;
      } else {
        throw new Error(response.message || 'Failed to update vendor');
      }
    } catch (err: any) {
      console.error('Update vendor error:', err);
      setError(err.message || 'Failed to update vendor');
      return false;
    }
  }, []);

  const deleteVendor = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await vendorService.deleteVendor(id);
      
      if (response.success) {
        setVendors(prev => prev.filter(vendor => vendor.id !== id));
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete vendor');
      }
    } catch (err: any) {
      console.error('Delete vendor error:', err);
      setError(err.message || 'Failed to delete vendor');
      return false;
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      setError(null);
      
      const response = await vendorService.getVendorStats();
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        throw new Error(response.message || 'Failed to load vendor statistics');
      }
    } catch (err: any) {
      console.error('Load vendor stats error:', err);
      setError(err.message || 'Failed to load vendor statistics');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  return {
    vendors,
    pagination,
    loading,
    error,
    stats,
    statsLoading,
    loadVendors,
    createVendor,
    updateVendor,
    deleteVendor,
    loadStats,
    clearError
  };
};