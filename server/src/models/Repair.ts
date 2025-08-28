import { Schema, model, Connection, Types } from 'mongoose';

export interface IRepair {
  _id: Types.ObjectId;
  assetId: string;
  assetName: string;
  issue: string;
  description?: string;
  vendor: string;
  vendorId: string;
  status: 'In Progress' | 'Awaiting Parts' | 'Complete' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  cost: number;
  estimatedCost?: number;
  dateCreated: Date;
  dateStarted?: Date;
  dateCompleted?: Date;
  estimatedCompletion?: Date;
  reportedBy: string;
  assignedTechnician?: string;
  notes?: string;
  companyId: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const repairSchema = new Schema<IRepair>({
  assetId: {
    type: String,
    required: true,
    index: true
  },
  assetName: {
    type: String,
    required: true
  },
  issue: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 1000
  },
  vendor: {
    type: String,
    required: true
  },
  vendorId: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['In Progress', 'Awaiting Parts', 'Complete', 'Cancelled'],
    default: 'In Progress',
    index: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  cost: {
    type: Number,
    default: 0,
    min: 0
  },
  estimatedCost: {
    type: Number,
    min: 0
  },
  dateCreated: {
    type: Date,
    default: Date.now,
    index: true
  },
  dateStarted: {
    type: Date
  },
  dateCompleted: {
    type: Date
  },
  estimatedCompletion: {
    type: Date
  },
  reportedBy: {
    type: String,
    required: true
  },
  assignedTechnician: {
    type: String
  },
  notes: {
    type: String,
    maxlength: 2000
  },
  companyId: {
    type: String,
    required: true,
    index: true
  },
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String
  }
}, {
  timestamps: true
});

repairSchema.index({ companyId: 1, status: 1 });
repairSchema.index({ companyId: 1, dateCreated: -1 });
repairSchema.index({ companyId: 1, vendor: 1 });

repairSchema.virtual('duration').get(function() {
  if (this.dateCompleted && this.dateStarted) {
    return Math.ceil((this.dateCompleted.getTime() - this.dateStarted.getTime()) / (1000 * 60 * 60 * 24));
  }
  return null;
});

export const createRepairModel = (connection: Connection) => {
  return connection.model<IRepair>('Repair', repairSchema);
};