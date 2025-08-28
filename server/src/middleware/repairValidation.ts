import { body, param, ValidationChain, query } from 'express-validator';

export const validateCreateRepair: ValidationChain[] = [
  body('assetId')
    .trim()
    .notEmpty()
    .withMessage('Asset ID is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Asset ID must be between 1 and 50 characters'),

  body('assetName')
    .trim()
    .notEmpty()
    .withMessage('Asset name is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Asset name must be between 1 and 200 characters'),

  body('issue')
    .trim()
    .notEmpty()
    .withMessage('Issue description is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Issue description must be between 5 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('vendor')
    .trim()
    .notEmpty()
    .withMessage('Vendor name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Vendor name must be between 1 and 100 characters'),

  body('vendorId')
    .trim()
    .notEmpty()
    .withMessage('Vendor ID is required'),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Priority must be Low, Medium, High, or Critical'),

  body('estimatedCost')
    .optional()
    .isNumeric()
    .withMessage('Estimated cost must be a number')
    .isFloat({ min: 0 })
    .withMessage('Estimated cost cannot be negative'),

  body('estimatedCompletion')
    .optional()
    .isISO8601()
    .withMessage('Estimated completion date must be a valid date'),

  body('assignedTechnician')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Assigned technician name cannot exceed 100 characters'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Notes cannot exceed 2000 characters')
];

export const validateUpdateRepair: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid repair ID'),

  body('issue')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Issue description must be between 5 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('vendor')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Vendor name must be between 1 and 100 characters'),

  body('status')
    .optional()
    .isIn(['In Progress', 'Awaiting Parts', 'Complete', 'Cancelled'])
    .withMessage('Status must be In Progress, Awaiting Parts, Complete, or Cancelled'),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Priority must be Low, Medium, High, or Critical'),

  body('cost')
    .optional()
    .isNumeric()
    .withMessage('Cost must be a number')
    .isFloat({ min: 0 })
    .withMessage('Cost cannot be negative'),

  body('estimatedCost')
    .optional()
    .isNumeric()
    .withMessage('Estimated cost must be a number')
    .isFloat({ min: 0 })
    .withMessage('Estimated cost cannot be negative'),

  body('dateStarted')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),

  body('estimatedCompletion')
    .optional()
    .isISO8601()
    .withMessage('Estimated completion date must be a valid date'),

  body('assignedTechnician')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Assigned technician name cannot exceed 100 characters'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Notes cannot exceed 2000 characters')
];

export const validateRepairId: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid repair ID')
];

export const validateRepairQuery: ValidationChain[] = [
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
    .isIn(['In Progress', 'Awaiting Parts', 'Complete', 'Cancelled'])
    .withMessage('Status must be In Progress, Awaiting Parts, Complete, or Cancelled'),

  query('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Priority must be Low, Medium, High, or Critical'),

  query('vendor')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Vendor filter cannot exceed 100 characters'),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Search query cannot exceed 200 characters'),

  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
];