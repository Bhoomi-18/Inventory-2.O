import { Schema, model, Document, Connection } from 'mongoose';

export interface IAssignment extends Document {
  asset: {
    id: string;
    name: string;
    assetId: string;
  };
  assignedTo: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  assignmentDate: Date;
  expectedReturn: Date;
  actualReturn?: Date;
  status: 'Active' | 'Overdue' | 'Returned';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
}

const assignmentSchema = new Schema<IAssignment>({
  asset: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    assetId: { type: String, required: true }
  },
  assignedTo: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true }
  },
  assignmentDate: { type: Date, required: true },
  expectedReturn: { type: Date, required: true },
  actualReturn: { type: Date },
  status: { 
    type: String, 
    enum: ['Active', 'Overdue', 'Returned'], 
    default: 'Active' 
  },
  notes: { type: String },
  companyId: { type: String, required: true }
}, {
  timestamps: true
});

assignmentSchema.index({ companyId: 1, status: 1 });
assignmentSchema.index({ 'asset.id': 1 });
assignmentSchema.index({ 'assignedTo.id': 1 });
assignmentSchema.index({ assignmentDate: 1 });
assignmentSchema.index({ expectedReturn: 1 });

assignmentSchema.virtual('isOverdue').get(function(this: IAssignment) {
  return this.status === 'Active' && new Date() > this.expectedReturn;
});

assignmentSchema.pre('save', function(this: IAssignment) {
  if (this.status === 'Active' && new Date() > this.expectedReturn) {
    this.status = 'Overdue';
  }
});

export const createAssignmentModel = (connection: Connection) => {
  return connection.model<IAssignment>('Assignment', assignmentSchema);
};