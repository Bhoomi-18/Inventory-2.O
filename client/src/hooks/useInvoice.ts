import { useState, useEffect, useCallback } from 'react';
import invoiceService, { type InvoiceQuery, type CreateInvoiceRequest } from '../services/invoiceService';
import type { Invoice, InvoiceStats } from '../types/invoice';
import { handleApiError } from '../utils/errorHandler';

export interface UseInvoicesOptions {
  initialQuery?: InvoiceQuery;
  autoLoad?: boolean;
}

export const useInvoices = (options: UseInvoicesOptions = {}) => {
  const { initialQuery = {}, autoLoad = true } = options;
  
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const loadInvoices = useCallback(async (query: InvoiceQuery = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await invoiceService.getInvoices({ ...initialQuery, ...query });
      
      if (response.success && response.data) {
        setInvoices(response.data.invoices);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.message || 'Failed to load invoices');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [initialQuery]);

  const createInvoice = async (invoiceData: CreateInvoiceRequest) => {
    try {
      setError(null);
      const response = await invoiceService.createInvoice(invoiceData);
      
      if (response.success && response.data) {
        await loadInvoices();
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create invoice');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    }
  };

  const updateInvoice = async (id: string, invoiceData: Partial<CreateInvoiceRequest>) => {
    try {
      setError(null);
      const response = await invoiceService.updateInvoice(id, invoiceData);
      
      if (response.success && response.data) {
        setInvoices(prev => prev.map(invoice => 
          invoice.id === id ? response.data! : invoice
        ));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update invoice');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      setError(null);
      const response = await invoiceService.deleteInvoice(id);
      
      if (response.success) {
        setInvoices(prev => prev.filter(invoice => invoice.id !== id));
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete invoice');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    }
  };

  const markInvoicePaid = async (id: string) => {
    try {
      setError(null);
      const response = await invoiceService.markInvoicePaid(id);
      
      if (response.success && response.data) {
        setInvoices(prev => prev.map(invoice => 
          invoice.id === id ? response.data! : invoice
        ));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to mark invoice as paid');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    }
  };

  const bulkDeleteInvoices = async (ids: string[]) => {
    try {
      setError(null);
      const response = await invoiceService.bulkDeleteInvoices(ids);
      
      if (response.success) {
        setInvoices(prev => prev.filter(invoice => !ids.includes(invoice.id)));
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete invoices');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    if (autoLoad) {
      loadInvoices();
    }
  }, [loadInvoices, autoLoad]);

  return {
    invoices,
    loading,
    error,
    pagination,
    loadInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    markInvoicePaid,
    bulkDeleteInvoices,
    refetch: () => loadInvoices()
  };
};

export const useInvoiceStats = () => {
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await invoiceService.getInvoiceStats();
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        throw new Error(response.message || 'Failed to load invoice statistics');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refetch: loadStats
  };
};

export const useInvoice = (id: string | null) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInvoice = useCallback(async (invoiceId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await invoiceService.getInvoice(invoiceId);
      
      if (response.success && response.data) {
        setInvoice(response.data);
      } else {
        throw new Error(response.message || 'Failed to load invoice');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      loadInvoice(id);
    } else {
      setInvoice(null);
      setError(null);
    }
  }, [id, loadInvoice]);

  return {
    invoice,
    loading,
    error,
    refetch: id ? () => loadInvoice(id) : () => {}
  };
};