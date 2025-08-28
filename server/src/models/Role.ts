import mongoose, { Schema, Model, Connection, Document } from 'mongoose';

export interface IPermission {
  id: string;
  name: string;
  module: string;
  actions: string[];
}

export interface IRole {
  name: string;
  description: string;
  permissions: IPermission[];
  isSystem: boolean;
  companyId: string;
}

const permissionSchema: Schema<IPermission> = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  module: { type: String, required: true },
  actions: [{ type: String, required: true }]
});

const roleSchema: Schema<IRole> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    permissions: [permissionSchema],
    companyId: { type: String, required: true }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: any) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

roleSchema.index({ name: 1, companyId: 1 }, { unique: true });

export default function createRoleModel(connection: Connection): Model<IRole> {
  return connection.model<IRole>('Role', roleSchema);
}
