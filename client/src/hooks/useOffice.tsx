import { useState, useEffect, useCallback } from 'react';
import * as officeService from '../services/officeService';
import type { Office } from '../types/office';

export function useOffices() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await officeService.getOffices();
      setOffices(res.data || []);
    } catch (err: any) {
      console.error('Fetch offices error:', err);
      setError(err.message || 'Failed to fetch offices');
    } finally {
      setLoading(false);
    }
  }, []);

  const createOffice = useCallback(async (office: Partial<Office>) => {
    try {
      setError(null);
      const res = await officeService.createOffice(office);
      if (res.data) {
        setOffices(prev => [...prev, res.data as Office]);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Create office error:', err);
      setError(err.message || 'Failed to create office');
      return false;
    }
  }, []);

  const updateOffice = useCallback(async (id: string, office: Partial<Office>) => {
    try {
      setError(null);
      const res = await officeService.updateOffice(id, office);
      if (res.data) {
        setOffices(prev => prev.map(o => (o.id === id ? { ...o, ...res.data } : o)));
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Update office error:', err);
      setError(err.message || 'Failed to update office');
      return false;
    }
  }, []);

  const deleteOffice = useCallback(async (id: string) => {
    try {
      setError(null);
      await officeService.deleteOffice(id);
      setOffices(prev => prev.filter(o => o.id !== id));
      return true;
    } catch (err: any) {
      console.error('Delete office error:', err);
      setError(err.message || 'Failed to delete office');
      return false;
    }
  }, []);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  return { offices, loading, error, fetchOffices, createOffice, updateOffice, deleteOffice };
}

export function useOffice(id: string) {
  const [office, setOffice] = useState<Office | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffice = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await officeService.getOffice(id);
      setOffice(res.data || null);
    } catch (err: any) {
      console.error('Fetch office error:', err);
      setError(err.message || 'Failed to fetch office');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOffice();
  }, [fetchOffice]);

  return { office, loading, error, refetch: fetchOffice };
}