import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const errorField = (error: any) => ('path' in error ? error.path : undefined);

export const validateCreateInvoice = [
  body('vendor')
    .notEmpty()
    .withMessage('Vendor name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Vendor name must be between 2 and 100 characters'),
  body('vendorId')
    .notEmpty()
    .withMessage('Vendor ID is required')
    .trim(),
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom((value) => {
      if (value < 0) throw new Error('Amount must be positive');
      return true;
    }),
  body('taxAmount')
    .optional()
    .isNumeric()
    .withMessage('Tax amount must be a number')
    .custom((value) => {
      if (value < 0) throw new Error('Tax amount must be positive');
      return true;
    }),
  body('totalAmount')
    .isNumeric()
    .withMessage('Total amount must be a number')
    .custom((value) => {
      if (value < 0) throw new Error('Total amount must be positive');
      return true;
    }),
  body('issueDate')
    .isISO8601()
    .withMessage('Issue date must be a valid date'),
  body('dueDate')
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom((dueDate, { req }) => {
      if (new Date(dueDate) <= new Date(req.body.issueDate)) {
        throw new Error('Due date must be after issue date');
      }
      return true;
    }),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Description must be between 5 and 500 characters'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.description')
    .notEmpty()
    .withMessage('Item description is required'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Item quantity must be at least 1'),
  body('items.*.unitPrice')
    .isNumeric()
    .withMessage('Unit price must be a number')
    .custom((value) => {
      if (value < 0) throw new Error('Unit price must be positive');
      return true;
    }),
  body('items.*.totalPrice')
    .isNumeric()
    .withMessage('Total price must be a number')
    .custom((value) => {
      if (value < 0) throw new Error('Total price must be positive');
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(error => ({
          field: errorField(error),
          message: error.msg
        }))
      });
    }
    next();
  }
];

export const validateUpdateInvoice = [
  param('id')
    .isMongoId()
    .withMessage('Invalid invoice ID'),
  body('vendor')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Vendor name must be between 2 and 100 characters'),
  body('amount')
    .optional()
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom((value) => {
      if (value < 0) throw new Error('Amount must be positive');
      return true;
    }),
  body('taxAmount')
    .optional()
    .isNumeric()
    .withMessage('Tax amount must be a number')
    .custom((value) => {
      if (value < 0) throw new Error('Tax amount must be positive');
      return true;
    }),
  body('totalAmount')
    .optional()
    .isNumeric()
    .withMessage('Total amount must be a number')
    .custom((value) => {
      if (value < 0) throw new Error('Total amount must be positive');
      return true;
    }),
  body('issueDate')
    .optional()
    .isISO8601()
    .withMessage('Issue date must be a valid date'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('status')
    .optional()
    .isIn(['Pending', 'Paid', 'Overdue', 'Cancelled'])
    .withMessage('Invalid status'),
  body('description')
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage('Description must be between 5 and 500 characters'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(error => ({
          field: errorField(error),
          message: error.msg
        }))
      });
    }
    next();
  }
];

export const validateInvoiceId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid invoice ID'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid invoice ID',
        errors: errors.array().map(error => ({
          field: errorField(error),
          message: error.msg
        }))
      });
    }
    next();
  }
];

export const validateInvoiceQuery = [
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
    .isIn(['Pending', 'Paid', 'Overdue', 'Cancelled'])
    .withMessage('Invalid status filter'),
  query('vendor')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Vendor filter cannot be empty'),
  query('search')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Search term cannot be empty'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array().map(error => ({
          field: errorField(error),
          message: error.msg
        }))
      });
    }
    next();
  }
];