import httpClient from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';
import type { RepairTicket, RepairStats, RepairRequest, RepairQuery } from '../types/repair';

export interface RepairResponse {
  repairs: RepairTicket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class RepairService {
  async getRepairs(params?: RepairQuery): Promise<RepairResponse> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = queryParams.toString() 
      ? `${API_ENDPOINTS.REPAIRS.LIST}?${queryParams.toString()}`
      : API_ENDPOINTS.REPAIRS.LIST;

    const response = await httpClient.get<RepairResponse>(endpoint);
    return response.data!;
  }

  async getRepairStats(): Promise<RepairStats> {
    const response = await httpClient.get<RepairStats>(`${API_ENDPOINTS.REPAIRS.LIST}/stats`);
    return response.data!;
  }

  async getRepair(id: string): Promise<RepairTicket> {
    const response = await httpClient.get<RepairTicket>(API_ENDPOINTS.REPAIRS.GET(id));
    return response.data!;
  }

  async createRepair(data: RepairRequest): Promise<RepairTicket> {
    const response = await httpClient.post<RepairTicket>(API_ENDPOINTS.REPAIRS.CREATE, data);
    return response.data!;
  }

  async updateRepair(id: string, data: Partial<RepairRequest>): Promise<RepairTicket> {
    const response = await httpClient.put<RepairTicket>(API_ENDPOINTS.REPAIRS.UPDATE(id), data);
    return response.data!;
  }

  async deleteRepair(id: string): Promise<void> {
    await httpClient.delete(API_ENDPOINTS.REPAIRS.DELETE(id));
  }

  async completeRepair(id: string, data: { cost?: number; notes?: string }): Promise<RepairTicket> {
    const response = await httpClient.put<RepairTicket>(API_ENDPOINTS.REPAIRS.COMPLETE(id), data);
    return response.data!;
  }

  async bulkDeleteRepairs(ids: string[]): Promise<void> {
    await httpClient.post(`${API_ENDPOINTS.REPAIRS.LIST}/bulk-delete`, { ids });
  }

  async exportRepairs(params?: RepairQuery): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = queryParams.toString() 
      ? `${API_ENDPOINTS.REPAIRS.LIST}/export?${queryParams.toString()}`
      : `${API_ENDPOINTS.REPAIRS.LIST}/export`;

    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('empcare_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return await response.blob();
  }
}

export default new RepairService();