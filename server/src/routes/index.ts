import express, { Request, Response } from 'express';
import authRoutes from './auth';
import assetRoutes from './assets';
import roleRoutes from './role';
import userRoutes from './user';
import officeRoutes from './office';
import vendorRoutes from './vendor';
import invoiceRoutes from './invoice';
import assignmentRoutes from './assignment';
import repairRoutes from './repair';
import reportRoutes from './report';
import dashboardRoutes from './dashboard';

const router = express.Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Empcare API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

router.use('/auth', authRoutes);
router.use('/assets', assetRoutes);
router.use('/roles', roleRoutes);
router.use('/users', userRoutes);
router.use('/offices', officeRoutes);
router.use('/vendors', vendorRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/repairs', repairRoutes);
router.use('/reports', reportRoutes);
router.use('/dashboard', dashboardRoutes);

router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to Empcare API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      assets: '/api/assets',
      vendors: '/api/vendors',
      users: '/api/users',
      offices: '/api/offices',
      roles: '/api/roles'
    }
  });
});

export default router;