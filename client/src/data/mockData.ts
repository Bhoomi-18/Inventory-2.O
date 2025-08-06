import type { Asset, Assignment, Vendor, RepairTicket, ChartData, TrendData } from '../types';

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