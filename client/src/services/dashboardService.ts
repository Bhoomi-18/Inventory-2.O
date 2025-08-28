import httpClient from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';

export interface DashboardStats {
  totalAssets: number;
  assignedItems: number;
  underRepair: number;
  lowStockAlerts: number;
  assetDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  assignmentTrends: Array<{
    month: string;
    newAssignments: number;
    returns: number;
  }>;
  recentActivity: Array<{
    id: string;
    text: string;
    time: string;
    color: string;
  }>;
  alerts: Array<{
    id: string;
    type: 'critical' | 'warning' | 'info';
    title: string;
    message: string;
  }>;
}

class DashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await httpClient.get<DashboardStats>(API_ENDPOINTS.DASHBOARD.STATS);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch dashboard statistics');
      }

      return response.data;
    } catch (error: any) {
      console.error('Dashboard service error:', error);
      throw new Error(error.message || 'Failed to fetch dashboard statistics');
    }
  }

  async quickAddAsset(assetData: {
    name: string;
    category: string;
    serialNumber: string;
    purchaseDate: string;
    purchasePrice: number;
    vendor: string;
    location: string;
  }) {
    try {
      const response = await httpClient.post(API_ENDPOINTS.ASSETS.CREATE, assetData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to add asset');
      }

      return response.data;
    } catch (error: any) {
      console.error('Quick add asset error:', error);
      throw new Error(error.message || 'Failed to add asset');
    }
  }

  async bulkUpload(formData: FormData) {
    try {
      const response = await fetch(`${httpClient['baseURL']}${API_ENDPOINTS.ASSETS.BULK_UPLOAD}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('empcare_token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to upload file');
      }

      return data;
    } catch (error: any) {
      console.error('Bulk upload error:', error);
      throw new Error(error.message || 'Failed to upload file');
    }
  }
}

export default new DashboardService();