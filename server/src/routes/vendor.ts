import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';
import { checkPermission, PERMISSIONS } from '../middleware/permissions';
import {
  validateCreateVendor,
  validateUpdateVendor,
  validateVendorId,
  validateVendorQuery
} from '../middleware/vendorValidation';
import {
  getVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
  getVendorStats
} from '../controllers/vendors/vendorController';

const router = express.Router();

router.use(authenticate);

router.get('/', 
  validateVendorQuery,
  handleValidationErrors,
  checkPermission(PERMISSIONS.VENDORS_READ),
  getVendors
);

router.get('/stats',
  checkPermission(PERMISSIONS.VENDORS_READ),
  getVendorStats
);

router.get('/:id',
  validateVendorId,
  handleValidationErrors,
  checkPermission(PERMISSIONS.VENDORS_READ),
  getVendor
);

router.post('/',
  validateCreateVendor,
  handleValidationErrors,
  checkPermission(PERMISSIONS.VENDORS_WRITE),
  createVendor
);

router.put('/:id',
  validateUpdateVendor,
  handleValidationErrors,
  checkPermission(PERMISSIONS.VENDORS_WRITE),
  updateVendor
);

router.delete('/:id',
  validateVendorId,
  handleValidationErrors,
  checkPermission(PERMISSIONS.VENDORS_DELETE),
  deleteVendor
);

export default router;