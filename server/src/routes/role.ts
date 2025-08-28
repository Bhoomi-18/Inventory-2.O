import express from 'express';
import { getRoles, createRole, updateRole, deleteRole } from '../controllers/roles/roleController';
import { validateCreateRole } from '../middleware/roleValidation';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/', getRoles);
router.post('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log("Incoming role payload:", req.body);
  next();
}, validateCreateRole, createRole);
router.put('/:id', validateCreateRole, updateRole);
router.delete('/:id', deleteRole);

export default router;
