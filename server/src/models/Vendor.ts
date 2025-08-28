import { Schema, model, Document, Connection } from 'mongoose';

export interface IVendor extends Document {
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

const VendorSchema = new Schema<IVendor>({
  name: {
    type: String,
    required: [true, 'Vendor name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [300, 'Address cannot exceed 300 characters']
  },
  contactPerson: {
    type: String,
    trim: true,
    maxlength: [100, 'Contact person name cannot exceed 100 characters']
  },
  totalOrders: {
    type: Number,
    default: 0,
    min: [0, 'Total orders cannot be negative']
  },
  totalValue: {
    type: Number,
    default: 0,
    min: [0, 'Total value cannot be negative']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  status: {
    type: String,
    enum: ['Active', 'Review', 'Inactive'],
    default: 'Active'
  },
  companyId: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

VendorSchema.index({ companyId: 1, name: 1 });
VendorSchema.index({ companyId: 1, status: 1 });

export const getVendorModel = (connection: Connection) => {
  return connection.model<IVendor>('Vendor', VendorSchema);
};