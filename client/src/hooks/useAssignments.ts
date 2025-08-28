import { useState, useEffect, useCallback } from 'react';
import assignmentService, { 
  type AssignmentFilters, 
  type AssignmentStats, 
  type CreateAssignmentData 
} from '../services/assignmentService';
import type { Assignment } from '../types/assignment';
import { handleApiError } from '../utils/errorHandler';

interface UseAssignmentsReturn {
  assignments: Assignment[];
  stats: AssignmentStats;
  pagination: {
    current: number;
    total: number;
    count: number;
    totalRecords: number;
  };
  loading: boolean;
  error: string | null;
  filters: AssignmentFilters;
  setFilters: (filters: AssignmentFilters) => void;
  refreshAssignments: () => Promise<void>;
  createAssignment: (data: CreateAssignmentData) => Promise<void>;
  updateAssignment: (id: string, data: Partial<CreateAssignmentData>) => Promise<void>;
  returnAsset: (id: string, notes?: string) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
}

export const useAssignments = (initialFilters: AssignmentFilters = {}): UseAssignmentsReturn => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState<AssignmentStats>({
    activeAssignments: 0,
    pendingReturns: 0,
    overdueReturns: 0,
    thisMonth: 0
  });
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalRecords: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AssignmentFilters>({
    page: 1,
    limit: 20,
    status: '',
    search: '',
    sort: '-createdAt',
    ...initialFilters
  });

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await assignmentService.getAssignments(filters);
      
      if (response.success && response.data) {
        setAssignments(response.data.assignments);
        setStats(response.data.stats);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.message || 'Failed to fetch assignments');
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Fetch assignments error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refreshAssignments = useCallback(async () => {
    await fetchAssignments();
  }, [fetchAssignments]);

  const createAssignment = useCallback(async (data: CreateAssignmentData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await assignmentService.createAssignment(data);
      
      if (response.success) {
        await refreshAssignments();
      } else {
        throw new Error(response.message || 'Failed to create assignment');
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [refreshAssignments]);

  const updateAssignment = useCallback(async (id: string, data: Partial<CreateAssignmentData>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await assignmentService.updateAssignment(id, data);
      
      if (response.success) {
        await refreshAssignments();
      } else {
        throw new Error(response.message || 'Failed to update assignment');
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [refreshAssignments]);

  const returnAsset = useCallback(async (id: string, notes?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await assignmentService.returnAsset(id, notes);
      
      if (response.success) {
        await refreshAssignments();
      } else {
        throw new Error(response.message || 'Failed to return asset');
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [refreshAssignments]);

  const deleteAssignment = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await assignmentService.deleteAssignment(id);
      
      if (response.success) {
        await refreshAssignments();
      } else {
        throw new Error(response.message || 'Failed to delete assignment');
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [refreshAssignments]);

  const updateFilters = useCallback((newFilters: AssignmentFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return {
    assignments,
    stats,
    pagination,
    loading,
    error,
    filters,
    setFilters: updateFilters,
    refreshAssignments,
    createAssignment,
    updateAssignment,
    returnAsset,
    deleteAssignment
  };
};