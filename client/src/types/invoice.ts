export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendor: string;
  vendorId: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
  description: string;
  items: InvoiceItem[];
  attachments?: string[];
}

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  assetId?: string;
}

export interface InvoiceStats {
  totalInvoices: number;
  totalAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  paidThisMonth: number;
  pendingCount: number;
  overdueCount: number;
}

export interface InvoiceFilters {
  status?: string;
  vendor?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
}

export interface InvoicePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateInvoiceRequest {
  invoiceNumber: string;
  vendor: string;
  vendorId: string;
  taxAmount: number;
  issueDate: string;
  dueDate: string;
  description: string;
  items: Omit<InvoiceItem, 'id'>[];
  status?: 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
  attachments?: string[];
}

export interface UpdateInvoiceRequest extends Partial<CreateInvoiceRequest> {
  paidDate?: string;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  pagination: InvoicePagination;
}

export interface InvoiceStatsResponse {
  success: boolean;
  data: InvoiceStats;
}

export interface InvoiceResponse {
  success: boolean;
  data: Invoice;
  message?: string;
}

export interface InvoiceListApiResponse {
  success: boolean;
  data: InvoiceListResponse;
  message?: string;
}