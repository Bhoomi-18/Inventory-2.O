export interface CreateVendorData {
  name: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
  contactPerson: string;
  status?: 'Active' | 'Review' | 'Inactive';
  rating?: number;
}

export interface UpdateVendorData extends Partial<CreateVendorData> {
  totalOrders?: number;
  totalValue?: number;
}

export interface VendorFormData extends CreateVendorData {}

export interface VendorError {
  field: string;
  message: string;
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  totalOrders: number;
  totalValue: number;
  rating: number;
  status: 'Active' | 'Review' | 'Inactive';
  companyId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}