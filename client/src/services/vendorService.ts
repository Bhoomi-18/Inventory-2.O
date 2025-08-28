import httpClient from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';
import type { Vendor } from '../types/vendor';

export interface VendorFilters {
  page?: number;
  limit?: number;
  status?: 'Active' | 'Review' | 'Inactive';
  search?: string;
}

export interface VendorResponse {
  vendors: Vendor[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface VendorStats {
  totalVendors: number;
  activeVendors: number;
  reviewVendors: number;
  inactiveVendors: number;
  totalValue: number;
  totalOrders: number;
  averageRating: number;
}

export interface CreateVendorData {
  name: string;
  description: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  status?: 'Active' | 'Review' | 'Inactive';
}

export interface UpdateVendorData extends Partial<CreateVendorData> {
  totalOrders?: number;
  totalValue?: number;
  rating?: number;
}

class VendorService {
  async getVendors(filters: VendorFilters = {}) {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.VENDORS.LIST}?${queryString}` : API_ENDPOINTS.VENDORS.LIST;
    
    return httpClient.get<VendorResponse>(endpoint);
  }

  async getVendor(id: string) {
    return httpClient.get<Vendor>(API_ENDPOINTS.VENDORS.GET(id));
  }

  async createVendor(data: CreateVendorData) {
    return httpClient.post<Vendor>(API_ENDPOINTS.VENDORS.CREATE, data);
  }

  async updateVendor(id: string, data: UpdateVendorData) {
    return httpClient.put<Vendor>(API_ENDPOINTS.VENDORS.UPDATE(id), data);
  }

  async deleteVendor(id: string) {
    return httpClient.delete(API_ENDPOINTS.VENDORS.DELETE(id));
  }

  async getVendorStats() {
    return httpClient.get<VendorStats>(API_ENDPOINTS.VENDORS.LIST + '/stats');
  }
}

const vendorService = new VendorService();
export default vendorService;