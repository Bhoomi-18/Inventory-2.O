import { body, param, ValidationChain } from 'express-validator';
import { AssetCategory, AssetStatus, AssetCondition } from '../types';

const assetCategories: AssetCategory[] = [
  'Computers & Laptops',
  'Monitors & Displays',
  'Mobile Devices',
  'Network Equipment',
  'Office Equipment',
  'Other'
];

const assetStatuses: AssetStatus[] = ['Available', 'Assigned', 'Under Repair'];
const assetConditions: AssetCondition[] = ['Excellent', 'Good', 'Fair', 'Poor'];

export const validateAsset: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Asset name is required')
    .isLength({ max: 100 })
    .withMessage('Asset name must be less than 100 characters'),

  body('category')
    .isIn(assetCategories)
    .withMessage('Invalid category'),

  body('serialNumber')
    .trim()
    .notEmpty()
    .withMessage('Serial number is required')
    .isLength({ max: 50 })
    .withMessage('Serial number must be less than 50 characters'),

  body('purchaseDate')
    .isISO8601()
    .withMessage('Invalid purchase date format'),

  body('purchasePrice')
    .isFloat({ min: 0 })
    .withMessage('Purchase price must be a positive number'),

  body('vendor')
    .trim()
    .notEmpty()
    .withMessage('Vendor is required')
    .isLength({ max: 100 })
    .withMessage('Vendor name must be less than 100 characters'),

  body('status')
    .optional()
    .isIn(assetStatuses)
    .withMessage('Invalid status'),

  body('condition')
    .optional()
    .isIn(assetConditions)
    .withMessage('Invalid condition'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must be less than 100 characters'),

  body('assignedTo')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Assigned to must be less than 100 characters'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
];

export const validateAssetId: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid asset ID')
];