import httpClient from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';
import type { Assignment } from '../types/assignment';

export interface AssignmentStats {
  activeAssignments: number;
  pendingReturns: number;
  overdueReturns: number;
  thisMonth: number;
}

export interface AssignmentResponse {
  assignments: Assignment[];
  stats: AssignmentStats;
  pagination: {
    current: number;
    total: number;
    count: number;
    totalRecords: number;
  };
}

export interface CreateAssignmentData {
  assetId: string;
  userId: string;
  expectedReturn: string;
  notes?: string;
}

export interface AssignmentFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sort?: string;
}

class AssignmentService {
  async getAssignments(filters: AssignmentFilters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const endpoint = queryParams.toString() 
      ? `${API_ENDPOINTS.ASSIGNMENTS.LIST}?${queryParams.toString()}`
      : API_ENDPOINTS.ASSIGNMENTS.LIST;

    return httpClient.get<AssignmentResponse>(endpoint);
  }

  async getAssignment(id: string) {
    return httpClient.get<Assignment>(API_ENDPOINTS.ASSIGNMENTS.GET(id));
  }

  async createAssignment(data: CreateAssignmentData) {
    return httpClient.post<Assignment>(API_ENDPOINTS.ASSIGNMENTS.CREATE, data);
  }

  async updateAssignment(id: string, data: Partial<CreateAssignmentData>) {
    return httpClient.put<Assignment>(API_ENDPOINTS.ASSIGNMENTS.UPDATE(id), data);
  }

  async returnAsset(id: string, notes?: string) {
    return httpClient.post<Assignment>(API_ENDPOINTS.ASSIGNMENTS.RETURN(id), { notes });
  }

  async deleteAssignment(id: string) {
    return httpClient.delete(API_ENDPOINTS.ASSIGNMENTS.DELETE(id));
  }
}

export default new AssignmentService();