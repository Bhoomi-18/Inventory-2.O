import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  asset: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId;
  assignedBy: mongoose.Types.ObjectId;
  assignedDate: Date;
  returnedDate?: Date;
  status: 'active' | 'returned';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>({
  asset: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedDate: { type: Date, default: Date.now },
  returnedDate: { type: Date },
  status: { type: String, enum: ['active', 'returned'], default: 'active' },
  notes: String
}, {
  timestamps: true
});

export default mongoose.model<IAssignment>('Assignment', assignmentSchema);