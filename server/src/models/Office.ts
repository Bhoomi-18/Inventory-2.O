import mongoose, { Schema, Document, Model, Connection } from 'mongoose';

export interface IOffice extends Document {
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
  createdAt: Date;
  isMain?: boolean;
}

const officeSchema = new Schema<IOffice>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  contactInfo: {
    phone: String,
    email: String,
  },
  manager: String,
  managerId: String,
  totalAssets: { type: Number, default: 0 },
  assignedAssets: { type: Number, default: 0 },
  availableAssets: { type: Number, default: 0 },
  employees: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  isMain: { type: Boolean, default: false }
});

export default function createOfficeModel(connection: Connection): Model<IOffice> {
  return connection.model<IOffice>('Office', officeSchema);
}