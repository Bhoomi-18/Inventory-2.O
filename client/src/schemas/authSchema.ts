import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const signupSchema = z.object({
  companyName: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s&.-]+$/, 'Company name contains invalid characters'),
  adminEmail: z.string().email('Please enter a valid email address'),
  adminPassword: z.string()
    .min(8, 'Admin password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  generalPassword: z.string()
    .min(6, 'General password must be at least 6 characters')
    .max(20, 'General password must be less than 20 characters')
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;