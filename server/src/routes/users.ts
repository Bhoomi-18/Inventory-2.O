import express from 'express';
import User, { UserRole } from '../models/User';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all users (Admin/Manager only)
router.get('/', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), async (req: AuthRequest, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats (Admin/Manager only)
router.get('/dashboard-stats', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), async (req: AuthRequest, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const Asset = require('../models/Asset').default;
    const Assignment = require('../models/Assignment').default;
    
    const totalAssets = await Asset.countDocuments();
    const availableAssets = await Asset.countDocuments({ status: 'available' });
    const assignedAssets = await Asset.countDocuments({ status: 'assigned' });
    const maintenanceAssets = await Asset.countDocuments({ status: 'maintenance' });
    
    const activeAssignments = await Assignment.countDocuments({ status: 'active' });

    res.json({
      totalUsers,
      totalAssets,
      availableAssets,
      assignedAssets,
      maintenanceAssets,
      activeAssignments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;