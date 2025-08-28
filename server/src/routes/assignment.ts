import express from 'express';
import {
  getAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  returnAsset
} from '../controllers/assignments/assignmentController';
import {
  validateCreateAssignment,
  validateUpdateAssignment,
  validateGetAssignments,
  validateGetAssignment,
  validateDeleteAssignment,
  validateReturnAsset
} from '../middleware/assignmentValidation';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/', validateGetAssignments, getAssignments);

router.get('/:id', validateGetAssignment, getAssignment);

router.post('/', validateCreateAssignment, createAssignment);

router.put('/:id', validateUpdateAssignment, updateAssignment);

router.post('/:id/return', validateReturnAsset, returnAsset);

router.delete('/:id', authorize('admin'), validateDeleteAssignment, deleteAssignment);

export default router;