import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { AuthRequest } from '../types';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.type === 'field' ? (error as any).path : 'unknown',
        message: error.msg
      }))
    });
    return;
  }
  
  next();
};

export const validateCreateAssignment = [
  body('assetId')
    .notEmpty()
    .withMessage('Asset ID is required')
    .isMongoId()
    .withMessage('Invalid asset ID format'),
    
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID format'),
    
  body('expectedReturn')
    .notEmpty()
    .withMessage('Expected return date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const returnDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (returnDate <= today) {
        throw new Error('Expected return date must be in the future');
      }
      return true;
    }),
    
  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
    
  handleValidationErrors
];

export const validateUpdateAssignment = [
  param('id')
    .isMongoId()
    .withMessage('Invalid assignment ID format'),
    
  body('expectedReturn')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      if (value) {
        const returnDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (returnDate <= today) {
          throw new Error('Expected return date must be in the future');
        }
      }
      return true;
    }),
    
  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
    
  handleValidationErrors
];

export const validateReturnAsset = [
  param('id')
    .isMongoId()
    .withMessage('Invalid assignment ID format'),
    
  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
    .isLength({ max: 500 })
    .withMessage('Return notes cannot exceed 500 characters'),
    
  handleValidationErrors
];

export const validateGetAssignments = [
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
    .isIn(['Active', 'Overdue', 'Returned', 'All Status'])
    .withMessage('Invalid status filter'),
    
  query('search')
    .optional()
    .isString()
    .withMessage('Search must be a string')
    .isLength({ max: 100 })
    .withMessage('Search query cannot exceed 100 characters'),
    
  query('sort')
    .optional()
    .isIn([
      'createdAt', '-createdAt',
      'assignmentDate', '-assignmentDate',
      'expectedReturn', '-expectedReturn',
      'asset.name', '-asset.name',
      'assignedTo.name', '-assignedTo.name'
    ])
    .withMessage('Invalid sort field'),
    
  handleValidationErrors
];

export const validateGetAssignment = [
  param('id')
    .isMongoId()
    .withMessage('Invalid assignment ID format'),
    
  handleValidationErrors
];

export const validateDeleteAssignment = [
  param('id')
    .isMongoId()
    .withMessage('Invalid assignment ID format'),
    
  handleValidationErrors
];