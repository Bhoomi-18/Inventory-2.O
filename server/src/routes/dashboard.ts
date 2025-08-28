import express from 'express';
import { authenticate } from '../middleware/auth';
import { getDashboardStats } from '../controllers/dashboard/dashboardController';

const router = express.Router();

router.get('/stats', authenticate, getDashboardStats);

export default router;