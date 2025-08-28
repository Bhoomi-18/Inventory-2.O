import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateCreateVendor = [
  body('name')
    .notEmpty()
    .withMessage('Vendor name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters')
    .trim(),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters')
    .trim(),
  
  body('address')
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage('Address must be between 5 and 500 characters')
    .trim(),
  
  body('contactPerson')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Contact person must be between 2 and 100 characters')
    .trim(),
  
  body('status')
    .optional()
    .isIn(['Active', 'Review', 'Inactive'])
    .withMessage('Status must be Active, Review, or Inactive'),
  
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
];

export const validateUpdateVendor = [
  param('id')
    .isMongoId()
    .withMessage('Invalid vendor ID'),
  
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters')
    .trim(),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters')
    .trim(),
  
  body('address')
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage('Address must be between 5 and 500 characters')
    .trim(),
  
  body('contactPerson')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Contact person must be between 2 and 100 characters')
    .trim(),
  
  body('status')
    .optional()
    .isIn(['Active', 'Review', 'Inactive'])
    .withMessage('Status must be Active, Review, or Inactive'),
  
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  
  body('totalOrders')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total orders must be a non-negative integer'),
  
  body('totalValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total value must be a non-negative number'),
];

export const validateVendorId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid vendor ID'),
];

export const validateVendorQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('status')
    .optional()
    .isIn(['Active', 'Review', 'Inactive'])
    .withMessage('Status must be Active, Review, or Inactive'),
  
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters')
    .trim(),
];