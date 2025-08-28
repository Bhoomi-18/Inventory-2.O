import mongoose, { Schema, Model, Connection } from 'mongoose';
import { IUser } from '../types';

const userSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    index: true
  },
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
    index: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required']
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
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

userSchema.index({ email: 1, companyId: 1 }, { unique: true });

userSchema.statics.findByEmailInCompany = function(email: string, companyId: string) {
  return this.findOne({ 
    email: email.toLowerCase(), 
    companyId: companyId,
    isActive: true 
  });
};

export default function createUserModel(connection: Connection): Model<IUser> {
  return connection.model<IUser>('User', userSchema);
}