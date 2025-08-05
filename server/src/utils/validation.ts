import { z } from 'zod';

export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'manager', 'employee']),
  department: z.string().min(1, 'Department is required')
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export const assetSchema = z.object({
  assetTag: z.string().min(1, 'Asset tag is required'),
  name: z.string().min(1, 'Asset name is required'),
  category: z.enum(['laptop', 'desktop', 'monitor', 'mobile', 'tablet', 'printer', 'router', 'switch', 'server', 'other']),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'), // Keep as 'model' for validation
  serialNumber: z.string().min(1, 'Serial number is required'),
  purchaseDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
  purchasePrice: z.number().positive('Purchase price must be positive'),
  warrantyExpiration: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  specifications: z.object({
    processor: z.string().optional(),
    ram: z.string().optional(),
    storage: z.string().optional(),
    os: z.string().optional(),
    other: z.string().optional()
  }).optional(),
  notes: z.string().optional()
});