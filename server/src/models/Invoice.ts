import { Schema, model, Document, Types, Connection } from 'mongoose';

export interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  assetId?: string;
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

const InvoiceItemSchema = new Schema<IInvoiceItem>({
  description: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
  assetId: { type: String, trim: true }
});

const InvoiceSchema = new Schema<IInvoice>({
  invoiceNumber: { type: String, required: true, unique: true, trim: true },
  vendor: { type: String, required: true, trim: true },
  vendorId: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  taxAmount: { type: Number, required: true, min: 0, default: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  paidDate: { type: Date },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Pending'
  },
  description: { type: String, required: true, trim: true },
  items: [InvoiceItemSchema],
  attachments: [{ type: String, trim: true }],
  companyId: { type: String, required: true },
  createdBy: { type: String, required: true }
}, {
  timestamps: true
});

InvoiceSchema.index({ companyId: 1, status: 1 });
InvoiceSchema.index({ companyId: 1, invoiceNumber: 1 });
InvoiceSchema.index({ companyId: 1, vendor: 1 });

InvoiceSchema.pre<IInvoice>('save', async function(next) {
  if (!this.invoiceNumber) {
    const year = new Date().getFullYear();
    const InvoiceModel = this.constructor as import('mongoose').Model<IInvoice>;
    const count = await InvoiceModel.countDocuments({ companyId: this.companyId });
    this.invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  if (this.status === 'Pending' && this.dueDate < new Date()) {
    this.status = 'Overdue';
  }
  next();
});

export const createInvoiceModel = (connection: Connection) => {
  return connection.model('Invoice', InvoiceSchema);
};