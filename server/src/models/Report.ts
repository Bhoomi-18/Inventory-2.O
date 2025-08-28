import { Schema, Document, Types, Connection } from 'mongoose';

export interface IReport extends Document {
  _id: Types.ObjectId;
  name: string;
  type: 'Asset Utilization' | 'Assignment History' | 'Repair Analytics' | 'Vendor Performance' | 'Cost Analysis' | 'Custom';
  description: string;
  generatedBy: string;
  dateGenerated: Date;
  format: 'PDF' | 'Excel' | 'CSV';
  status: 'Generated' | 'Generating' | 'Failed';
  fileSize?: string;
  downloadUrl?: string;
  config: {
    dateRange: {
      start: Date;
      end: Date;
    };
    filters: {
      office?: string;
      department?: string;
      category?: string;
    };
  };
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>({
  name: { type: String, required: true, trim: true },
  type: {
    type: String,
    required: true,
    enum: ['Asset Utilization', 'Assignment History', 'Repair Analytics', 'Vendor Performance', 'Cost Analysis', 'Custom']
  },
  description: { type: String, trim: true },
  generatedBy: { type: String, required: true },
  dateGenerated: { type: Date, default: Date.now },
  format: {
    type: String,
    required: true,
    enum: ['PDF', 'Excel', 'CSV'],
    default: 'PDF'
  },
  status: {
    type: String,
    enum: ['Generated', 'Generating', 'Failed'],
    default: 'Generating'
  },
  fileSize: { type: String },
  downloadUrl: { type: String },
  config: {
    dateRange: {
      start: { type: Date, required: true },
      end: { type: Date, required: true }
    },
    filters: {
      office: String,
      department: String,
      category: String
    }
  },
  companyId: { type: String, required: true }
}, {
  timestamps: true
});

reportSchema.index({ companyId: 1, createdAt: -1 });
reportSchema.index({ status: 1 });
reportSchema.index({ type: 1 });

export const createReportModel = (connection: Connection) => {
  return connection.model('Report', reportSchema);
};