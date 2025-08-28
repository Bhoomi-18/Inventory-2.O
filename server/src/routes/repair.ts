import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';
import {
  validateCreateRepair,
  validateUpdateRepair,
  validateRepairId,
  validateRepairQuery
} from '../middleware/repairValidation';
import {
  getRepairs,
  getRepairStats,
  getRepair,
  createRepair,
  updateRepair,
  deleteRepair,
  completeRepair
} from '../controllers/repairs/repairController';

const router = express.Router();

router.use(authenticate);

router.get('/stats', getRepairStats as express.RequestHandler);

router.get(
  '/',
  validateRepairQuery,
  handleValidationErrors,
  getRepairs as express.RequestHandler
);

router.get(
  '/:id',
  validateRepairId,
  handleValidationErrors,
  getRepair as unknown as express.RequestHandler
);

router.post(
  '/',
  validateCreateRepair,
  handleValidationErrors,
  createRepair as express.RequestHandler
);

router.put(
  '/:id',
  validateUpdateRepair,
  handleValidationErrors,
  updateRepair as unknown as express.RequestHandler
);

router.put(
  '/:id/complete',
  validateRepairId,
  handleValidationErrors,
  completeRepair as unknown as express.RequestHandler
);

router.delete(
  '/:id',
  authorize('admin'),
  validateRepairId,
  handleValidationErrors,
  deleteRepair as unknown as express.RequestHandler
);

export default router;