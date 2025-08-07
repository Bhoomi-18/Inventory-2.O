export interface Office {
  id: string;
  name: string;
  code: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactInfo: {
    phone?: string;
    email?: string;
  };
  manager?: string;
  managerId?: string;
  totalAssets: number;
  assignedAssets: number;
  availableAssets: number;
  employees: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}