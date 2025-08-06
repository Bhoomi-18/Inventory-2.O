export interface Asset {
  id: string;
  name: string;
  description?: string;
  category: string;
  status: 'Available' | 'Assigned' | 'Under Repair';
  assignedTo?: string;
  office: string;
  vendor?: string;
}

export interface AssetFilters {
  search: string;
  category: string;
  status: string;
  office: string;
  vendor: string;
}