import httpClient from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';
import type { Report } from '../types/report';

interface ReportConfig {
  type: string;
  name: string;
  description: string;
  format: string;
  dateRange: {
    start: string;
    end: string;
  };
  filters: {
    office?: string;
    department?: string;
    category?: string;
  };
}

interface ReportStats {
  totalReports: number;
  generated: number;
  generating: number;
  failed: number;
  thisMonthCount: number;
  successRate: number;
}

interface PaginatedReports {
  reports: Report[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

class ReportService {
  async getReports(params: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    search?: string;
  } = {}): Promise<PaginatedReports> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const queryString = queryParams.toString();
      const endpoint = queryString ? `${API_ENDPOINTS.REPORTS.LIST}?${queryString}` : API_ENDPOINTS.REPORTS.LIST;
      
      const response = await httpClient.get<PaginatedReports>(endpoint);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch reports');
      }

      return response.data;
    } catch (error: any) {
      console.error('ReportService.getReports error:', error);
      throw new Error(error.message || 'Failed to fetch reports');
    }
  }

  async getReportStats(): Promise<ReportStats> {
    try {
      const response = await httpClient.get<ReportStats>(API_ENDPOINTS.REPORTS.STATS);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch report statistics');
      }

      return response.data;
    } catch (error: any) {
      console.error('ReportService.getReportStats error:', error);
      throw new Error(error.message || 'Failed to fetch report statistics');
    }
  }

  async generateReport(config: ReportConfig): Promise<Report> {
    try {
      const response = await httpClient.post<Report>(API_ENDPOINTS.REPORTS.CREATE, config);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to generate report');
      }

      return response.data;
    } catch (error: any) {
      console.error('ReportService.generateReport error:', error);
      throw new Error(error.message || 'Failed to generate report');
    }
  }

  async downloadReport(reportId: string): Promise<void> {
    try {
      const downloadUrl = `${httpClient['baseURL']}${API_ENDPOINTS.REPORTS.DOWNLOAD(reportId)}`;
      
      const token = localStorage.getItem('empcare_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Download failed');
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'report.pdf';
      
      if (contentDisposition) {
        const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
        if (matches) {
          filename = matches[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error: any) {
      console.error('ReportService.downloadReport error:', error);
      throw new Error(error.message || 'Failed to download report');
    }
  }

  async deleteReport(reportId: string): Promise<void> {
    try {
      const response = await httpClient.delete(API_ENDPOINTS.REPORTS.DELETE(reportId));
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete report');
      }
    } catch (error: any) {
      console.error('ReportService.deleteReport error:', error);
      throw new Error(error.message || 'Failed to delete report');
    }
  }
}

const reportService = new ReportService();
export default reportService;