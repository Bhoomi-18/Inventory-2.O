import mongoose, { Schema, Model, Connection } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ICompany } from '../types';

const companySchema: Schema<ICompany> = new Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Company name must be at least 2 characters'],
    maxlength: [100, 'Company name must be less than 100 characters'],
    match: [/^[a-zA-Z0-9\s&.-]+$/, 'Company name contains invalid characters']
  },
  adminEmail: {
    type: String,
    required: [true, 'Admin email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  adminPassword: {
    type: String,
    required: [true, 'Admin password is required'],
    minlength: [8, 'Admin password must be at least 8 characters']
  },
  generalPassword: {
    type: String,
    required: [true, 'General password is required'],
    minlength: [6, 'General password must be at least 6 characters'],
    maxlength: [20, 'General password must be less than 20 characters']
  },
  databaseName: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret: any) {
      delete ret.adminPassword;
      delete ret.generalPassword;
      delete ret.__v;
      return ret;
    }
  }
});

companySchema.pre<ICompany>('save', async function(next) {
  if (!this.isModified('adminPassword') && !this.isModified('generalPassword')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    
    if (this.isModified('adminPassword')) {
      this.adminPassword = await bcrypt.hash(this.adminPassword, salt);
    }
    
    if (this.isModified('generalPassword')) {
      this.generalPassword = await bcrypt.hash(this.generalPassword, salt);
    }
    
    next();
  } catch (error: any) {
    next(error);
  }
});

companySchema.methods.compareAdminPassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.adminPassword);
};

companySchema.methods.compareGeneralPassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.generalPassword);
};

companySchema.statics.findByEmail = function(email: string) {
  return this.findOne({ adminEmail: email.toLowerCase() });
};

export default function createCompanyModel(connection: Connection): Model<ICompany> {
  return connection.model<ICompany>('Company', companySchema);
}