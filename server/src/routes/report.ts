import express from 'express';
import {
  getReports,
  getReportStats,
  generateReport,
  downloadReport,
  deleteReport
} from '../controllers/report/reportController';
import { authenticate, authorize } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';
import {
  validateGenerateReport,
  validateReportId,
  validateReportQuery
} from '../middleware/reportValidation';

const router = express.Router();

router.use(authenticate);

router.get('/stats', getReportStats);

router.get('/', validateReportQuery, handleValidationErrors, getReports);

router.post(
  '/',
  authorize('admin', 'user'),
  validateGenerateReport,
  handleValidationErrors,
  generateReport
);

router.get(
  '/:id/download',
  validateReportId,
  handleValidationErrors,
  downloadReport
);

router.delete(
  '/:id',
  authorize('admin', 'user'),
  validateReportId,
  handleValidationErrors,
  deleteReport
);

export default router;