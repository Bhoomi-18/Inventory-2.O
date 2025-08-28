import { body } from 'express-validator';

export const validateCreateRole = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Role name must be between 2 and 50 characters'),

  body('description')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Description must be at least 2 characters long'),

  body('permissions')
    .isArray()
    .withMessage('Permissions must be an array')
];
