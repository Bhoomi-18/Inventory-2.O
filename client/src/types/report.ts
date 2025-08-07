export interface Report {
  id: string;
  name: string;
  type: 'Asset Utilization' | 'Assignment History' | 'Repair Analytics' | 'Vendor Performance' | 'Cost Analysis' | 'Custom';
  description: string;
  generatedBy: string;
  dateGenerated: string;
  format: 'PDF' | 'Excel' | 'CSV';
  status: 'Generated' | 'Generating' | 'Failed';
  fileSize?: string;
  downloadUrl?: string;
}

export interface ReportFilters {
  search: string;
  type: string;
  status: string;
  dateRange: string;
}