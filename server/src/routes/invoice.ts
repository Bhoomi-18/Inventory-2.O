import express from 'express';
import invoiceController from '../controllers/invoice/invoiceController';
import {
  validateCreateInvoice,
  validateUpdateInvoice,
  validateInvoiceId,
  validateInvoiceQuery
} from '../middleware/invoiceValidation';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/', validateInvoiceQuery, invoiceController.getInvoices);

router.get('/stats', invoiceController.getInvoiceStats);

router.get('/:id', validateInvoiceId, invoiceController.getInvoice);

router.post('/', validateCreateInvoice, invoiceController.createInvoice);

router.put('/:id', validateUpdateInvoice, invoiceController.updateInvoice);

router.patch('/:id/mark-paid', validateInvoiceId, invoiceController.markPaid);

router.delete('/:id', validateInvoiceId, invoiceController.deleteInvoice);

router.post('/bulk-delete', invoiceController.bulkDelete);

export default router;