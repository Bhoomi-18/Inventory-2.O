export interface Assignment {
  id: string;
  _id?: string; 
  asset: string; 
  assetId: string; 
  assignedTo: string; 
  department: string;
  assignmentDate: string;
  expectedReturn: string;
  actualReturn?: string;
  status: 'Active' | 'Overdue' | 'Returned';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  companyId?: string;
}

export interface CreateAssignmentRequest {
  assetId: string;
  userId: string;
  expectedReturn: string;
  notes?: string;
}

export interface UpdateAssignmentRequest {
  expectedReturn?: string;
  notes?: string;
}

export interface ReturnAssetRequest {
  notes?: string;
}

export interface AssignmentFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sort?: string;
}

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