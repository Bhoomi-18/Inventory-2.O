import httpClient from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';
import type { Invoice, InvoiceStats } from '../types/invoice';

export interface InvoiceQuery {
  page?: number;
  limit?: number;
  status?: string;
  vendor?: string;
  search?: string;
}

export interface InvoiceResponse {
  invoices: Invoice[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateInvoiceRequest {
  vendor: string;
  vendorId: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  description: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    assetId?: string;
  }>;
  attachments?: string[];
}

class InvoiceService {
  async getInvoices(query: InvoiceQuery = {}) {
    try {
      const queryString = new URLSearchParams(
        Object.entries(query).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== '') {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      const endpoint = queryString ? `${API_ENDPOINTS.INVOICES.LIST}?${queryString}` : API_ENDPOINTS.INVOICES.LIST;
      const response = await httpClient.get<InvoiceResponse>(endpoint);
      return response;
    } catch (error) {
      console.error('Get invoices error:', error);
      throw error;
    }
  }

  async getInvoice(id: string) {
    try {
      const response = await httpClient.get<Invoice>(API_ENDPOINTS.INVOICES.GET(id));
      return response;
    } catch (error) {
      console.error('Get invoice error:', error);
      throw error;
    }
  }

  async createInvoice(invoiceData: CreateInvoiceRequest) {
    try {
      const response = await httpClient.post<Invoice>(API_ENDPOINTS.INVOICES.CREATE, invoiceData);
      return response;
    } catch (error) {
      console.error('Create invoice error:', error);
      throw error;
    }
  }

  async updateInvoice(id: string, invoiceData: Partial<CreateInvoiceRequest>) {
    try {
      const response = await httpClient.put<Invoice>(API_ENDPOINTS.INVOICES.UPDATE(id), invoiceData);
      return response;
    } catch (error) {
      console.error('Update invoice error:', error);
      throw error;
    }
  }

  async deleteInvoice(id: string) {
    try {
      const response = await httpClient.delete(API_ENDPOINTS.INVOICES.DELETE(id));
      return response;
    } catch (error) {
      console.error('Delete invoice error:', error);
      throw error;
    }
  }

  async markInvoicePaid(id: string) {
    try {
      const response = await httpClient.put<Invoice>(API_ENDPOINTS.INVOICES.MARK_PAID(id));
      return response;
    } catch (error) {
      console.error('Mark invoice paid error:', error);
      throw error;
    }
  }

  async getInvoiceStats() {
    try {
      const response = await httpClient.get<InvoiceStats>(API_ENDPOINTS.INVOICES.STATS);
      return response;
    } catch (error) {
      console.error('Get invoice stats error:', error);
      throw error;
    }
  }

  async bulkDeleteInvoices(ids: string[]) {
    try {
      const response = await httpClient.post(API_ENDPOINTS.INVOICES.BULK_DELETE, { ids });
      return response;
    } catch (error) {
      console.error('Bulk delete error:', error);
      throw error;
    }
  }

  async exportInvoices(query: InvoiceQuery = {}) {
    try {
      const queryString = new URLSearchParams(
        Object.entries(query).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== '') {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      const endpoint = queryString ? `${API_ENDPOINTS.INVOICES.EXPORT}?${queryString}` : API_ENDPOINTS.INVOICES.EXPORT;
      const response = await httpClient.get(endpoint);
      return response;
    } catch (error) {
      console.error('Export invoices error:', error);
      throw error;
    }
  }
}

export default new InvoiceService();