export interface Asset {
  _id: string;
  name: string;
  category: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: number;
  vendor: string;
  status: 'Available' | 'Assigned' | 'Under Repair';
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  location: string;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetFilters {
  search: string;
  category: string;
  status: string;
  office: string;
  vendor: string;
}

export interface AssetFormData {
  name: string;
  category: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: number;
  vendor: string;
  status?: string;
  condition?: string;
  location?: string;
  assignedTo?: string;
  notes?: string;
}

export interface AssetQuery {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
  location?: string;
}

export interface AssetListResponse {
  assets: Asset[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AssetStats {
  statusStats: Array<{ _id: string; count: number; totalValue: number }>;
  categoryStats: Array<{ _id: string; count: number }>;
  totalAssets: number;
  totalValue: number;
}

export type AssetCategory = 
  | 'Computers & Laptops'
  | 'Monitors & Displays'
  | 'Mobile Devices'
  | 'Network Equipment'
  | 'Office Equipment'
  | 'Other';

export type AssetStatus = 'Available' | 'Assigned' | 'Under Repair';
export type AssetCondition = 'Excellent' | 'Good' | 'Fair' | 'Poor';