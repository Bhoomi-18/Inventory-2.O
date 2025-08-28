import { Document, Types, Connection } from 'mongoose';
import { Request } from 'express';

export interface ICompany extends Document {
  _id: Types.ObjectId;
  name: string;
  adminEmail: string;
  adminPassword: string;
  generalPassword: string;
  databaseName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  compareAdminPassword(password: string): Promise<boolean>;
  compareGeneralPassword(password: string): Promise<boolean>;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  companyId: string;
  companyName: string;
  role: 'admin' | 'user';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAsset extends Document {
  _id: Types.ObjectId;
  name: string;
  category: AssetCategory;
  serialNumber: string;
  purchaseDate: Date;
  purchasePrice: number;
  vendor: string;
  status: AssetStatus;
  condition: AssetCondition;
  location: string;
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInvoice extends Document {
  _id: Types.ObjectId;
  invoiceNumber: string;
  vendor: string;
  vendorId: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  status: 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
  description: string;
  items: IInvoiceItem[];
  attachments?: string[];
  companyId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  assetId?: string;
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
export type UserRole = 'admin' | 'user';
export type InvoiceStatus = 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';

export interface IdParams {
  id: string;
}

export interface AuthRequest<
  Params = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user?: {
    userId: string;
    companyId: string;
    role: UserRole;
    email: string;
    companyName: string;
  };
  company?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  companyName: string;
  adminEmail: string;
  adminPassword: string;
  generalPassword: string;
}

export interface AuthResponse {
  token: string;
  user: IUser;
  company: Partial<ICompany>;
}

export interface JWTPayload {
  userId: string;
  companyId: string;
  role: UserRole;
  email?: string;
  companyName?: string;
  iat?: number;
  exp?: number;
}

export interface AssetRequest {
  name: string;
  category: AssetCategory;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: number;
  vendor: string;
  status?: AssetStatus;
  condition?: AssetCondition;
  location?: string;
  assignedTo?: string;
  notes?: string;
}

export interface AssetQuery {
  page?: number;
  limit?: number;
  status?: AssetStatus;
  category?: AssetCategory;
  search?: string;
}

export interface InvoiceRequest {
  invoiceNumber: string;
  vendor: string;
  vendorId: string;
  taxAmount: number;
  issueDate: string;
  dueDate: string;
  description: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    assetId?: string;
  }>;
}

export interface InvoiceQuery {
  page?: number;
  limit?: number;
  status?: InvoiceStatus;
  vendor?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
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
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ConnectionMap = Map<string, Connection>;