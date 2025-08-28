import express from 'express';
import { getOffices, createOffice, updateOffice, deleteOffice, getOffice } from '../controllers/office/officeController';
import { authenticate } from '../middleware/auth';
import { validateCreateOffice, validateUpdateOffice, validateOfficeId } from '../middleware/officeValidation';

const router = express.Router();

router.use(authenticate);

router.get('/', getOffices);
router.post('/', validateCreateOffice, createOffice);
router.get('/:id', validateOfficeId, getOffice);
router.put('/:id', validateUpdateOffice, updateOffice);
router.delete('/:id', validateOfficeId, deleteOffice);

export default router;