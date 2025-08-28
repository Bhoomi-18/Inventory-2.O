import mongoose, { Schema, Model, Connection } from 'mongoose';
import { IAsset, AssetCategory, AssetStatus, AssetCondition } from '../types';

const assetSchema: Schema<IAsset> = new Schema({
  name: {
    type: String,
    required: [true, 'Asset name is required'],
    trim: true,
    maxlength: [100, 'Asset name must be less than 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Computers & Laptops',
      'Monitors & Displays', 
      'Mobile Devices',
      'Network Equipment',
      'Office Equipment',
      'Other'
    ]
  },
  serialNumber: {
    type: String,
    required: [true, 'Serial number is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Serial number must be less than 50 characters']
  },
  purchaseDate: {
    type: Date,
    required: [true, 'Purchase date is required']
  },
  purchasePrice: {
    type: Number,
    required: [true, 'Purchase price is required'],
    min: [0, 'Purchase price must be positive']
  },
  vendor: {
    type: String,
    required: [true, 'Vendor is required'],
    trim: true,
    maxlength: [100, 'Vendor name must be less than 100 characters']
  },
  status: {
    type: String,
    enum: ['Available', 'Assigned', 'Under Repair'],
    default: 'Available'
  },
  condition: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },
  location: {
    type: String,
    default: 'Main Office',
    maxlength: [100, 'Location must be less than 100 characters']
  },
  assignedTo: {
    type: String,
    default: null,
    maxlength: [100, 'Assigned to must be less than 100 characters']
  },
  notes: {
    type: String,
    default: '',
    maxlength: [500, 'Notes must be less than 500 characters']
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret: any) {
      delete ret.__v;
      return ret;
    }
  }
});

assetSchema.index({ name: 'text', serialNumber: 'text', vendor: 'text' });
assetSchema.index({ status: 1, category: 1 });

export default function createAssetModel(connection: Connection): Model<IAsset> {
  return connection.model<IAsset>('Asset', assetSchema);
}