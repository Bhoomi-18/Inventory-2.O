import { body, param } from 'express-validator';

export const validateCreateOffice = [
  body('name')
    .notEmpty()
    .withMessage('Office name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Office name must be between 2 and 100 characters'),
    
  body('code')
    .notEmpty()
    .withMessage('Office code is required')
    .isLength({ min: 2, max: 20 })
    .withMessage('Office code must be between 2 and 20 characters')
    .matches(/^[A-Z0-9_-]+$/)
    .withMessage('Office code can only contain uppercase letters, numbers, underscores and hyphens'),
    
  body('address.street')
    .optional()
    .isString()
    .withMessage('Street must be a string'),
    
  body('address.city')
    .optional()
    .isString()
    .withMessage('City must be a string'),
    
  body('address.state')
    .optional()
    .isString()
    .withMessage('State must be a string'),
    
  body('address.zipCode')
    .optional()
    .isString()
    .withMessage('Zip code must be a string'),
    
  body('address.country')
    .optional()
    .isString()
    .withMessage('Country must be a string'),
    
  body('contactInfo.phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Invalid phone number format'),
    
  body('contactInfo.email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),
    
  body('manager')
    .optional()
    .isString()
    .withMessage('Manager must be a string'),
    
  body('status')
    .optional()
    .isIn(['Active', 'Inactive'])
    .withMessage('Status must be either Active or Inactive')
];

export const validateUpdateOffice = [
  param('id')
    .isMongoId()
    .withMessage('Invalid office ID format'),
    
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Office name must be between 2 and 100 characters'),
    
  body('code')
    .optional()
    .isLength({ min: 2, max: 20 })
    .withMessage('Office code must be between 2 and 20 characters')
    .matches(/^[A-Z0-9_-]+$/)
    .withMessage('Office code can only contain uppercase letters, numbers, underscores and hyphens'),
    
  body('address.street')
    .optional()
    .isString()
    .withMessage('Street must be a string'),
    
  body('address.city')
    .optional()
    .isString()
    .withMessage('City must be a string'),
    
  body('address.state')
    .optional()
    .isString()
    .withMessage('State must be a string'),
    
  body('address.zipCode')
    .optional()
    .isString()
    .withMessage('Zip code must be a string'),
    
  body('address.country')
    .optional()
    .isString()
    .withMessage('Country must be a string'),
    
  body('contactInfo.phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Invalid phone number format'),
    
  body('contactInfo.email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),
    
  body('manager')
    .optional()
    .isString()
    .withMessage('Manager must be a string'),
    
  body('status')
    .optional()
    .isIn(['Active', 'Inactive'])
    .withMessage('Status must be either Active or Inactive')
];

export const validateOfficeId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid office ID format')
];