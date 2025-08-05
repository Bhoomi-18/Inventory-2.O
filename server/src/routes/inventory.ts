import express from 'express';
import Asset, { AssetStatus } from '../models/Asset';
import Assignment from '../models/Assignment';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { assetSchema } from '../utils/validation';
import { UserRole } from '../models/User';

const router = express.Router();

// Get all assets
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status, category, assignedTo } = req.query;
    const filter: any = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (assignedTo) filter.assignedTo = assignedTo;

    const assets = await Asset.find(filter)
      .populate('assignedTo', 'name email department')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    return res.json(assets);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get single asset
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate('assignedTo', 'name email department')
      .populate('createdBy', 'name');
    
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    return res.json(asset);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create asset (Admin/Manager only)
router.post('/', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), async (req: AuthRequest, res) => {
  try {
    const validatedData = assetSchema.parse(req.body);
    
    const existingAsset = await Asset.findOne({ 
      $or: [
        { assetTag: validatedData.assetTag },
        { serialNumber: validatedData.serialNumber }
      ]
    });
    
    if (existingAsset) {
      return res.status(400).json({ message: 'Asset tag or serial number already exists' });
    }

    const asset = new Asset({
      ...validatedData,
      modelName: validatedData.model, // Map 'model' to 'modelName'
      purchaseDate: new Date(validatedData.purchaseDate),
      warrantyExpiration: validatedData.warrantyExpiration ? new Date(validatedData.warrantyExpiration) : undefined,
      createdBy: req.user!._id
    });

    await asset.save();
    await asset.populate('createdBy', 'name');
    
    return res.status(201).json(asset);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update asset (Admin/Manager only)
router.put('/:id', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), async (req: AuthRequest, res) => {
  try {
    const validatedData = assetSchema.partial().parse(req.body);
    
    const updateData: any = {
      ...validatedData,
      purchaseDate: validatedData.purchaseDate ? new Date(validatedData.purchaseDate) : undefined,
      warrantyExpiration: validatedData.warrantyExpiration ? new Date(validatedData.warrantyExpiration) : undefined
    };

    // Map 'model' to 'modelName' if present
    if (validatedData.model) {
      updateData.modelName = validatedData.model;
      delete updateData.model;
    }

    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('assignedTo', 'name email department').populate('createdBy', 'name');

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    return res.json(asset);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

// Assign asset (Admin/Manager only)
router.post('/:id/assign', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), async (req: AuthRequest, res) => {
  try {
    const { assignedTo, notes } = req.body;
    
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    if (asset.status !== AssetStatus.AVAILABLE) {
      return res.status(400).json({ message: 'Asset is not available for assignment' });
    }

    // Create assignment record
    const assignment = new Assignment({
      asset: asset._id,
      assignedTo,
      assignedBy: req.user!._id,
      notes
    });

    await assignment.save();

    // Update asset
    asset.assignedTo = assignedTo;
    asset.status = AssetStatus.ASSIGNED;
    await asset.save();

    await asset.populate('assignedTo', 'name email department');
    return res.json(asset);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Return asset (Admin/Manager only)
router.post('/:id/return', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), async (req: AuthRequest, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    if (asset.status !== AssetStatus.ASSIGNED) {
      return res.status(400).json({ message: 'Asset is not currently assigned' });
    }

    // Update assignment record
    await Assignment.findOneAndUpdate(
      { asset: asset._id, status: 'active' },
      { 
        status: 'returned',
        returnedDate: new Date()
      }
    );

    // Update asset
    asset.assignedTo = undefined;
    asset.status = AssetStatus.AVAILABLE;
    await asset.save();

    return res.json(asset);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete asset (Admin only)
router.delete('/:id', authenticate, authorize([UserRole.ADMIN]), async (req: AuthRequest, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    return res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;