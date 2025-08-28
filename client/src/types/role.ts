export type Permission =
  | 'assets'
  | 'assignments'
  | 'repairs'
  | 'vendors'
  | 'users'
  | 'reports'
  | 'settings'
  | 'invoices';

export interface Role {
  _id?: string;
  name: string;
  permissions: Permission[];
  companyId: string;
}