export const ASSET_CATEGORIES = [
  'Computers & Laptops',
  'Monitors & Displays',
  'Mobile Devices',
  'Network Equipment',
  'Office Equipment',
  'Other'
] as const;

export const ASSET_STATUSES = [
  'Available',
  'Assigned',
  'Under Repair'
] as const;

export const ASSIGNMENT_STATUSES = [
  'Active',
  'Overdue',
  'Returned'
] as const;

export const REPAIR_STATUSES = [
  'In Progress',
  'Awaiting Parts',
  'Complete',
  'Cancelled'
] as const;

export const VENDOR_STATUSES = [
  'Active',
  'Review',
  'Inactive'
] as const;

export const COLORS = {
  primary: 'bg-blue-600',
  success: 'bg-green-600',
  warning: 'bg-orange-600',
  error: 'bg-red-600',
  info: 'bg-gray-600',
  purple: 'bg-purple-600'
} as const;

export const ROUTES = {
  DASHBOARD: 'dashboard',
  INVENTORY: 'inventory',
  ASSIGNMENTS: 'assignments',
  VENDORS: 'vendors',
  REPAIRS: 'repairs',
  INVOICES: 'invoices',
  REPORTS: 'reports',
  USERS: 'users',
  OFFICES: 'offices',
  SETTINGS: 'settings'
} as const;

export const USER_ROLES = [
  'admin',
  'user'
] as const;

export const PERMISSIONS = [
  'assets',
  'assignments',
  'repairs',
  'vendors',
  'users',
  'reports',
  'settings',
  'invoices'
];