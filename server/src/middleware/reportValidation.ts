import { body, param, query, ValidationChain } from 'express-validator';

export const validateGenerateReport: ValidationChain[] = [
  body('type')
    .isIn(['Asset Utilization', 'Assignment History', 'Repair Analytics', 'Vendor Performance', 'Cost Analysis', 'Custom'])
    .withMessage('Invalid report type'),
    
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Report name must be between 1 and 100 characters'),
    
  body('format')
    .isIn(['PDF', 'Excel', 'CSV'])
    .withMessage('Invalid format. Must be PDF, Excel, or CSV'),
    
  body('dateRange.start')
    .isISO8601()
    .withMessage('Invalid start date format'),
    
  body('dateRange.end')
    .isISO8601()
    .withMessage('Invalid end date format')
    .custom((endDate, { req }) => {
      const startDate = req.body.dateRange?.start;
      if (startDate && new Date(endDate) <= new Date(startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
    
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
    
  body('filters')
    .optional()
    .isObject()
    .withMessage('Filters must be an object')
];

export const validateReportId: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid report ID')
];

export const validateReportQuery: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  query('type')
    .optional()
    .isIn(['Asset Utilization', 'Assignment History', 'Repair Analytics', 'Vendor Performance', 'Cost Analysis', 'Custom', 'All Types'])
    .withMessage('Invalid report type filter'),
    
  query('status')
    .optional()
    .isIn(['Generated', 'Generating', 'Failed', 'All Statuses'])
    .withMessage('Invalid status filter'),
    
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query cannot exceed 100 characters')
];