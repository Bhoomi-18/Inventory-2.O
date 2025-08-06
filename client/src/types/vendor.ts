export interface Vendor {
  id: string;
  name: string;
  description: string;
  totalOrders: number;
  totalValue: number;
  rating: number;
  status: 'Active' | 'Review' | 'Inactive';
}