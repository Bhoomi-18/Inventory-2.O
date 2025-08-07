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
  id: string;
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
}