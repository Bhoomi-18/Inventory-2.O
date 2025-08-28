import express from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/users/userController';
import { authenticate } from '../middleware/auth';

const router = express.Router();
router.use(authenticate);

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;