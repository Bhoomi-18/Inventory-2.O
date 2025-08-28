import { body, param, ValidationChain, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateSignup: ValidationChain[] = [
  body('companyName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s&.-]+$/)
    .withMessage('Company name contains invalid characters'),
    
  body('adminEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
    
  body('adminPassword')
    .isLength({ min: 8 })
    .withMessage('Admin password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
  body('generalPassword')
    .isLength({ min: 6, max: 20 })
    .withMessage('General password must be between 6 and 20 characters')
];

export const validateLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const validateCompanyName: ValidationChain[] = [
  query('companyName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s&.-]+$/)
    .withMessage('Company name contains invalid characters')
];

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: 'path' in err ? String(err.path) : 'unknown',
        message: err.msg
      }))
    });
  }
  
  next();
};