export interface Assignment {
  id: string;
  asset: string;
  assetId: string;
  assignedTo: string;
  department: string;
  assignmentDate: string;
  expectedReturn: string;
  status: 'Active' | 'Overdue' | 'Returned';
}