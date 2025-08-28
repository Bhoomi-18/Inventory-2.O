export interface Report {
  id: string;
  name: string;
  type: 'Asset Utilization' | 'Assignment History' | 'Repair Analytics' | 'Vendor Performance' | 'Cost Analysis' | 'Custom';
  description?: string;
  generatedBy: string;
  dateGenerated: string;
  format: 'PDF' | 'Excel' | 'CSV';
  status: 'Generated' | 'Generating' | 'Failed';
  fileSize?: string;
  downloadUrl?: string;
  config: {
    dateRange: {
      start: string;
      end: string;
    };
    filters: {
      office?: string;
      department?: string;
      category?: string;
    };
  };
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportFilters {
  search: string;
  type: string;
  status: string;
  dateRange: string;
}

export interface ReportConfig {
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

export interface ReportStats {
  totalReports: number;
  generated: number;
  generating: number;
  failed: number;
  thisMonthCount: number;
  successRate: number;
}