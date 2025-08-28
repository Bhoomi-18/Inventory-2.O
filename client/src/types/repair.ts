export interface RepairTicket {
  id: string;
  assetId: string;
  asset: string;
  assetName?: string; 
  issue: string;
  description?: string;
  vendor: string;
  vendorId: string;
  status: 'In Progress' | 'Awaiting Parts' | 'Complete' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  cost: number;
  estimatedCost?: number;
  dateCreated: string;
  dateStarted?: string;
  dateCompleted?: string;
  estimatedCompletion?: string;
  reportedBy: string;
  assignedTechnician?: string;
  notes?: string;
  duration?: number;
}

export interface RepairStats {
  underRepair: number;
  complete: number;
  awaitingParts: number;
  totalCost: number;
  avgRepairTime: number;
  priorityBreakdown: {
    Low: number;
    Medium: number;
    High: number;
    Critical: number;
  };
}

export interface RepairRequest {
  assetId: string;
  assetName: string;
  issue: string;
  description?: string;
  vendor: string;
  vendorId: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  estimatedCost?: number;
  estimatedCompletion?: string;
  assignedTechnician?: string;
  notes?: string;
}

export interface RepairQuery {
  page?: number;
  limit?: number;
  status?: 'In Progress' | 'Awaiting Parts' | 'Complete' | 'Cancelled';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  vendor?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}