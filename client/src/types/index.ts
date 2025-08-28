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
  companyId?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
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
  paidAmount: number;
  monthlyInvoices: number;
  monthlyAmount: number;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface InvoiceFilters {
  status?: 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
  vendor?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}