import type { Asset, Assignment, Vendor, RepairTicket, ChartData, TrendData, User, Invoice, Office, SystemSettings, UserRole, Report } from '../types';

export const assetDistributionData: ChartData[] = [
  { name: 'Computers', value: 40, color: '#3b82f6' },
  { name: 'Mobile Devices', value: 25, color: '#10b981' },
  { name: 'Network Equipment', value: 15, color: '#f59e0b' },
  { name: 'Office Equipment', value: 15, color: '#ef4444' },
  { name: 'Other', value: 5, color: '#8b5cf6' },
];

export const assignmentTrendsData: TrendData[] = [
  { month: 'Jan', newAssignments: 65, returns: 28 },
  { month: 'Feb', newAssignments: 78, returns: 35 },
  { month: 'Mar', newAssignments: 90, returns: 42 },
  { month: 'Apr', newAssignments: 81, returns: 45 },
  { month: 'May', newAssignments: 96, returns: 50 },
  { month: 'Jun', newAssignments: 105, returns: 68 },
];

export const sampleAssets: Asset[] = [
  {
    id: 'EMP-2024-001',
    name: 'MacBook Pro 16"',
    description: 'Apple M2 Pro, 32GB RAM',
    category: 'Computers & Laptops',
    status: 'Assigned',
    assignedTo: 'Sarah Chen',
    office: 'Main',
    vendor: 'Apple Inc.'
  },
  {
    id: 'EMP-2024-002',
    name: 'Dell UltraSharp 27"',
    description: '4K Monitor, USB-C',
    category: 'Monitors & Displays',
    status: 'Available',
    office: 'Main',
    vendor: 'Dell Technologies'
  },
];

export const sampleAssignments: Assignment[] = [
  {
    id: '1',
    asset: 'MacBook Pro 16"',
    assetId: 'EMP-2024-001',
    assignedTo: 'Sarah Chen',
    department: 'Development Team',
    assignmentDate: 'Jan 15, 2024',
    expectedReturn: 'Dec 31, 2024',
    status: 'Active'
  },
];

export const sampleVendors: Vendor[] = [
  {
    id: '1',
    name: 'Dell Technologies',
    description: 'Premium IT hardware supplier',
    totalOrders: 156,
    totalValue: 2847500,
    rating: 4.9,
    status: 'Active'
  },
  {
    id: '2',
    name: 'Apple Inc.',
    description: 'Premium mobile devices & computers',
    totalOrders: 89,
    totalValue: 1245000,
    rating: 4.8,
    status: 'Active'
  },
  {
    id: '3',
    name: 'TechSupply Co.',
    description: 'Network equipment & accessories',
    totalOrders: 23,
    totalValue: 156780,
    rating: 3.2,
    status: 'Review'
  },
];

export const sampleRepairTickets: RepairTicket[] = [
  {
    id: 'EMP-2024-045',
    asset: 'iPhone 14 Pro',
    assetId: 'EMP-2024-045',
    issue: 'Cracked screen',
    description: 'Dropped on concrete',
    vendor: 'iRepair Solutions',
    status: 'In Progress',
    cost: 299,
    dateCreated: '2024-01-10'
  },
];

// Reports Mock Data
export const sampleReports: Report[] = [
  {
    id: '1',
    name: 'Monthly Asset Utilization Report',
    type: 'Asset Utilization',
    description: 'Comprehensive analysis of asset usage across all departments',
    generatedBy: 'Nitesh Upadhayay',
    dateGenerated: '2024-01-15',
    format: 'PDF',
    status: 'Generated',
    fileSize: '2.4 MB',
    downloadUrl: '/reports/asset-utilization-jan-2024.pdf'
  },
  {
    id: '2',
    name: 'Q4 2023 Repair Analytics',
    type: 'Repair Analytics',
    description: 'Detailed breakdown of repair costs and turnaround times',
    generatedBy: 'Sarah Chen',
    dateGenerated: '2024-01-10',
    format: 'Excel',
    status: 'Generated',
    fileSize: '1.8 MB',
    downloadUrl: '/reports/repair-analytics-q4-2023.xlsx'
  },
  {
    id: '3',
    name: 'Vendor Performance Review',
    type: 'Vendor Performance',
    description: 'Annual vendor performance metrics and ratings',
    generatedBy: 'System',
    dateGenerated: '2024-01-12',
    format: 'PDF',
    status: 'Generating'
  }
];

// Invoices Mock Data
export const sampleInvoices: Invoice[] = [
  {
    id: 'INV-2024-001',
    invoiceNumber: 'DELL-2024-001',
    vendor: 'Dell Technologies',
    vendorId: '1',
    amount: 25000,
    taxAmount: 2250,
    totalAmount: 27250,
    issueDate: '2024-01-10',
    dueDate: '2024-02-10',
    status: 'Pending',
    description: 'Bulk purchase of Dell monitors and accessories',
    items: [
      {
        id: '1',
        description: 'Dell UltraSharp 27" Monitor',
        quantity: 20,
        unitPrice: 1200,
        totalPrice: 24000,
        assetId: 'EMP-2024-002'
      },
      {
        id: '2',
        description: 'HDMI Cables',
        quantity: 20,
        unitPrice: 50,
        totalPrice: 1000
      }
    ]
  },
  {
    id: 'INV-2024-002',
    invoiceNumber: 'APPLE-2024-001',
    vendor: 'Apple Inc.',
    vendorId: '2',
    amount: 15000,
    taxAmount: 1350,
    totalAmount: 16350,
    issueDate: '2024-01-05',
    dueDate: '2024-01-20',
    paidDate: '2024-01-18',
    status: 'Paid',
    description: 'MacBook Pro purchase for development team',
    items: [
      {
        id: '1',
        description: 'MacBook Pro 16" M2 Pro',
        quantity: 5,
        unitPrice: 3000,
        totalPrice: 15000,
        assetId: 'EMP-2024-001'
      }
    ]
  }
];

// Users Mock Data
export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Nitesh Upadhayay',
    email: 'nitesh@empcare.com',
    phone: '+1-555-0101',
    department: 'IT Administration',
    position: 'System Administrator',
    role: {
      id: '1',
      name: 'Admin',
      permissions: [],
      description: 'Full system access',
      isSystem: true
    },
    status: 'Active',
    lastLogin: '2024-01-15 09:30',
    createdAt: '2023-06-01',
    assignedAssets: 3,
    office: 'Main Office'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.chen@empcare.com',
    phone: '+1-555-0102',
    department: 'Development Team',
    position: 'Senior Developer',
    role: {
      id: '2',
      name: 'Employee',
      permissions: [],
      description: 'Standard employee access',
      isSystem: true
    },
    status: 'Active',
    lastLogin: '2024-01-15 08:45',
    createdAt: '2023-07-15',
    assignedAssets: 2,
    office: 'Main Office'
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    email: 'michael.r@empcare.com',
    department: 'Operations',
    position: 'Operations Manager',
    role: {
      id: '3',
      name: 'Manager',
      permissions: [],
      description: 'Department management access',
      isSystem: true
    },
    status: 'Active',
    lastLogin: '2024-01-14 16:20',
    createdAt: '2023-08-01',
    assignedAssets: 4,
    office: 'Main Office'
  }
];

export const sampleRoles: UserRole[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access and configuration',
    isSystem: true,
    permissions: [
      { id: '1', name: 'Asset Management', module: 'assets', actions: ['read', 'write', 'delete', 'admin'] },
      { id: '2', name: 'User Management', module: 'users', actions: ['read', 'write', 'delete', 'admin'] },
      { id: '3', name: 'System Settings', module: 'settings', actions: ['read', 'write', 'admin'] }
    ]
  },
  {
    id: '2',
    name: 'Employee',
    description: 'Standard employee access',
    isSystem: true,
    permissions: [
      { id: '1', name: 'Asset Management', module: 'assets', actions: ['read'] },
      { id: '4', name: 'My Assignments', module: 'assignments', actions: ['read', 'write'] }
    ]
  },
  {
    id: '3',
    name: 'Manager',
    description: 'Department management access',
    isSystem: true,
    permissions: [
      { id: '1', name: 'Asset Management', module: 'assets', actions: ['read', 'write'] },
      { id: '2', name: 'User Management', module: 'users', actions: ['read'] },
      { id: '5', name: 'Reports', module: 'reports', actions: ['read', 'write'] }
    ]
  }
];

// Offices Mock Data
export const sampleOffices: Office[] = [
  {
    id: '1',
    name: 'Main Office',
    code: 'HQ',
    address: {
      street: '123 Business District',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    contactInfo: {
      phone: '+1-555-0100',
      email: 'main@empcare.com'
    },
    manager: 'Nitesh Upadhayay',
    managerId: '1',
    totalAssets: 2847,
    assignedAssets: 1456,
    availableAssets: 1344,
    employees: 45,
    status: 'Active',
    createdAt: '2023-01-01'
  },
  {
    id: '2',
    name: 'West Coast Branch',
    code: 'WC',
    address: {
      street: '456 Innovation Way',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'United States'
    },
    contactInfo: {
      phone: '+1-555-0200',
      email: 'westcoast@empcare.com'
    },
    manager: 'Lisa Wang',
    managerId: '4',
    totalAssets: 1250,
    assignedAssets: 890,
    availableAssets: 315,
    employees: 28,
    status: 'Active',
    createdAt: '2023-03-15'
  }
];

// Settings Mock Data
export const sampleSettings: SystemSettings = {
  general: {
    companyName: 'Empcare Enterprise',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    language: 'en',
    defaultAssignmentPeriod: 365,
    lowStockThreshold: 10
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    assignmentReminders: true,
    returnReminders: true,
    repairUpdates: true,
    lowStockAlerts: true
  },
  security: {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expirationDays: 90
    },
    twoFactorAuth: true,
    sessionTimeout: 30,
    maxLoginAttempts: 3,
    auditLogs: true
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: 30,
    cloudStorage: true,
    lastBackup: '2024-01-15 02:00'
  },
  integration: {
    activeDirectory: true,
    googleWorkspace: false,
    slackIntegration: true,
    teamsIntegration: false,
    customWebhooks: ['https://webhook.example.com/empcare']
  }
};