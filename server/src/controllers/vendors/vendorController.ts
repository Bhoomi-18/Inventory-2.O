import { Response } from 'express';
import { validationResult } from 'express-validator';
import dbManager from '../../config/database';
import { getVendorModel } from '../../models/Vendor';
import { AuthRequest } from '../../types';

export const getVendors = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { companyName } = req.user!;
    const { page = 1, limit = 10, status, search } = req.query;

    const connection = await dbManager.getCompanyConnection(companyName);
    const Vendor = getVendorModel(connection);

    const query: any = { companyId: req.user!.companyId };
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const [vendors, total] = await Promise.all([
      Vendor.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Vendor.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        vendors,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalItems: total,
          hasNext: skip + vendors.length < total,
          hasPrev: Number(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendors'
    });
  }
};

export const getVendor = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { companyName } = req.user!;
    const { id } = req.params as {id : string};

    const connection = await dbManager.getCompanyConnection(companyName);
    const Vendor = getVendorModel(connection);

    const vendor = await Vendor.findOne({
      _id: id,
      companyId: req.user!.companyId
    }).lean();

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    console.error('Get vendor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor'
    });
  }
};

export const createVendor = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { companyName } = req.user!;
    const vendorData = {
      ...req.body,
      companyId: req.user!.companyId
    };

    const connection = await dbManager.getCompanyConnection(companyName);
    const Vendor = getVendorModel(connection);

    const existingVendor = await Vendor.findOne({
      name: { $regex: new RegExp(`^${vendorData.name}$`, 'i') },
      companyId: req.user!.companyId
    });

    if (existingVendor) {
      return res.status(409).json({
        success: false,
        message: 'Vendor with this name already exists'
      });
    }

    const vendor = new Vendor(vendorData);
    await vendor.save();

    res.status(201).json({
      success: true,
      message: 'Vendor created successfully',
      data: vendor
    });
  } catch (error) {
    console.error('Create vendor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create vendor'
    });
  }
};

export const updateVendor = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { companyName } = req.user!;
    const { id } = req.params as {id : string};
    const updateData = req.body;

    const connection = await dbManager.getCompanyConnection(companyName);
    const Vendor = getVendorModel(connection);

    if (updateData.name) {
      const existingVendor = await Vendor.findOne({
        name: { $regex: new RegExp(`^${updateData.name}$`, 'i') },
        companyId: req.user!.companyId,
        _id: { $ne: id }
      });

      if (existingVendor) {
        return res.status(409).json({
          success: false,
          message: 'Vendor with this name already exists'
        });
      }
    }

    const vendor = await Vendor.findOneAndUpdate(
      { _id: id, companyId: req.user!.companyId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      message: 'Vendor updated successfully',
      data: vendor
    });
  } catch (error) {
    console.error('Update vendor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vendor'
    });
  }
};

export const deleteVendor = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { companyName } = req.user!;
    const { id } = req.params as {id : string};

    const connection = await dbManager.getCompanyConnection(companyName);
    const Vendor = getVendorModel(connection);

    const vendor = await Vendor.findOneAndDelete({
      _id: id,
      companyId: req.user!.companyId
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      message: 'Vendor deleted successfully'
    });
  } catch (error) {
    console.error('Delete vendor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete vendor'
    });
  }
};

export const getVendorStats = async (req: AuthRequest, res: Response) => {
  try {
    const { companyName } = req.user!;
    const connection = await dbManager.getCompanyConnection(companyName);
    const Vendor = getVendorModel(connection);

    const stats = await Vendor.aggregate([
      { $match: { companyId: req.user!.companyId } },
      {
        $group: {
          _id: null,
          totalVendors: { $sum: 1 },
          activeVendors: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          },
          reviewVendors: {
            $sum: { $cond: [{ $eq: ['$status', 'Review'] }, 1, 0] }
          },
          inactiveVendors: {
            $sum: { $cond: [{ $eq: ['$status', 'Inactive'] }, 1, 0] }
          },
          totalValue: { $sum: '$totalValue' },
          totalOrders: { $sum: '$totalOrders' },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    const result = stats[0] || {
      totalVendors: 0,
      activeVendors: 0,
      reviewVendors: 0,
      inactiveVendors: 0,
      totalValue: 0,
      totalOrders: 0,
      averageRating: 0
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get vendor stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor statistics'
    });
  }
};