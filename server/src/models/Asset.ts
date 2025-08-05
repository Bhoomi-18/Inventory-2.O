import mongoose, { Document, Schema } from 'mongoose';

export enum AssetStatus {
  AVAILABLE = 'available',
  ASSIGNED = 'assigned',
  MAINTENANCE = 'maintenance',
  RETIRED = 'retired'
}

export enum AssetCategory {
  LAPTOP = 'laptop',
  DESKTOP = 'desktop',
  MONITOR = 'monitor',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  PRINTER = 'printer',
  ROUTER = 'router',
  SWITCH = 'switch',
  SERVER = 'server',
  OTHER = 'other'
}

export interface IAsset extends Document {
  assetTag: string;
  name: string;
  category: AssetCategory;
  brand: string;
  modelName: string; // Changed from 'model' to avoid conflict
  serialNumber: string;
  purchaseDate: Date;
  purchasePrice: number;
  warrantyExpiration?: Date;
  status: AssetStatus;
  assignedTo?: mongoose.Types.ObjectId;
  location: string;
  specifications?: {
    processor?: string;
    ram?: string;
    storage?: string;
    os?: string;
    other?: string;
  };
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const assetSchema = new Schema<IAsset>({
  assetTag: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, enum: Object.values(AssetCategory), required: true },
  brand: { type: String, required: true },
  modelName: { type: String, required: true }, // Changed from 'model'
  serialNumber: { type: String, required: true, unique: true },
  purchaseDate: { type: Date, required: true },
  purchasePrice: { type: Number, required: true },
  warrantyExpiration: { type: Date },
  status: { type: String, enum: Object.values(AssetStatus), default: AssetStatus.AVAILABLE },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  location: { type: String, required: true },
  specifications: {
    processor: String,
    ram: String,
    storage: String,
    os: String,
    other: String
  },
  notes: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export default mongoose.model<IAsset>('Asset', assetSchema);