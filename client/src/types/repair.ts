export interface RepairTicket {
  id: string;
  asset: string;
  assetId: string;
  issue: string;
  description?: string;
  vendor: string;
  status: 'In Progress' | 'Awaiting Parts' | 'Complete' | 'Cancelled';
  cost: number;
  dateCreated: string;
  dateCompleted?: string;
}