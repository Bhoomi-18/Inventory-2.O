import { Response, NextFunction } from 'express';
import dbManager from '../../config/database';
import { createRepairModel } from '../../models/Repair';
import { AuthRequest, IdParams } from '../../types';

interface RepairRequest {
  assetId: string;
  assetName: string;
  issue: string;
  description?: string;
  vendor: string;
  vendorId: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  estimatedCost?: number;
  estimatedCompletion?: string;
  assignedTechnician?: string;
  notes?: string;
}

interface RepairQuery {
  page?: number;
  limit?: number;
  status?: 'In Progress' | 'Awaiting Parts' | 'Complete' | 'Cancelled';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  vendor?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

interface UpdateRepairRequest {
  issue?: string;
  description?: string;
  vendor?: string;
  vendorId?: string;
  status?: 'In Progress' | 'Awaiting Parts' | 'Complete' | 'Cancelled';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  cost?: number;
  estimatedCost?: number;
  dateStarted?: string;
  estimatedCompletion?: string;
  assignedTechnician?: string;
  notes?: string;
}

export const getRepairs = async (
  req: AuthRequest<{}, any, any, RepairQuery>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyConnection = await dbManager.getCompanyConnection(req.user!.companyName);
    const RepairModel = createRepairModel(companyConnection);

    const {
      page = 1,
      limit = 10,
      status,
      priority,
      vendor,
      search,
      startDate,
      endDate
    } = req.query;

    const filter: any = { companyId: req.user!.companyId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (vendor) filter.vendor = { $regex: vendor, $options: 'i' };

    if (search) {
      filter.$or = [
        { issue: { $regex: search, $options: 'i' } },
        { assetName: { $regex: search, $options: 'i' } },
        { vendor: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      filter.dateCreated = {};
      if (startDate) filter.dateCreated.$gte = new Date(startDate);
      if (endDate) filter.dateCreated.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [repairs, total] = await Promise.all([
      RepairModel.find(filter)
        .sort({ dateCreated: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      RepairModel.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        repairs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error: any) {
    console.error('Error fetching repairs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch repairs'
    });
  }
};

export const getRepairStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyConnection = await dbManager.getCompanyConnection(req.user!.companyName);
    const RepairModel = createRepairModel(companyConnection);

    const filter = { companyId: req.user!.companyId };

    const [
      underRepair,
      complete,
      awaitingParts,
      totalCost,
      avgRepairTime,
      priorityBreakdown
    ] = await Promise.all([
      RepairModel.countDocuments({ ...filter, status: 'In Progress' }),
      RepairModel.countDocuments({ ...filter, status: 'Complete' }),
      RepairModel.countDocuments({ ...filter, status: 'Awaiting Parts' }),
      RepairModel.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: '$cost' } } }
      ]).then(result => result[0]?.total || 0),
      RepairModel.aggregate([
        {
          $match: {
            ...filter,
            status: 'Complete',
            dateStarted: { $ne: null },
            dateCompleted: { $ne: null }
          }
        },
        {
          $project: {
            duration: {
              $divide: [
                { $subtract: ['$dateCompleted', '$dateStarted'] },
                1000 * 60 * 60 * 24
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgDuration: { $avg: '$duration' }
          }
        }
      ]).then(result => Math.round(result[0]?.avgDuration || 0)),
      RepairModel.aggregate([
        { $match: filter },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        underRepair,
        complete,
        awaitingParts,
        totalCost,
        avgRepairTime,
        priorityBreakdown: priorityBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>)
      }
    });
  } catch (error: any) {
    console.error('Error fetching repair stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch repair statistics'
    });
  }
};

export const getRepair = async (
  req: AuthRequest<IdParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyConnection = await dbManager.getCompanyConnection(req.user!.companyName);
    const RepairModel = createRepairModel(companyConnection);

    const repair = await RepairModel.findOne({
      _id: req.params.id,
      companyId: req.user!.companyId
    });

    if (!repair) {
      res.status(404).json({
        success: false,
        message: 'Repair ticket not found'
      });
      return;
    }

    res.json({
      success: true,
      data: repair
    });
  } catch (error: any) {
    console.error('Error fetching repair:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch repair ticket'
    });
  }
};

export const createRepair = async (
  req: AuthRequest<{}, any, RepairRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyConnection = await dbManager.getCompanyConnection(req.user!.companyName);
    const RepairModel = createRepairModel(companyConnection);

    const repairData = {
      ...req.body,
      companyId: req.user!.companyId,
      createdBy: req.user!.userId,
      reportedBy: req.user!.userId,
      estimatedCompletion: req.body.estimatedCompletion ? new Date(req.body.estimatedCompletion) : undefined
    };

    const repair = await RepairModel.create(repairData);

    res.status(201).json({
      success: true,
      message: 'Repair ticket created successfully',
      data: repair
    });
  } catch (error: any) {
    console.error('Error creating repair:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create repair ticket'
    });
  }
};

export const updateRepair = async (
  req: AuthRequest<IdParams, any, UpdateRepairRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyConnection = await dbManager.getCompanyConnection(req.user!.companyName);
    const RepairModel = createRepairModel(companyConnection);

    const updateData: any = {
      ...req.body,
      updatedBy: req.user!.userId
    };

    if (req.body.dateStarted) {
      updateData.dateStarted = new Date(req.body.dateStarted);
    }
    if (req.body.estimatedCompletion) {
      updateData.estimatedCompletion = new Date(req.body.estimatedCompletion);
    }

    if (req.body.status === 'Complete') {
      updateData.dateCompleted = new Date();
    }

    const repair = await RepairModel.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user!.companyId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!repair) {
      res.status(404).json({
        success: false,
        message: 'Repair ticket not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Repair ticket updated successfully',
      data: repair
    });
  } catch (error: any) {
    console.error('Error updating repair:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update repair ticket'
    });
  }
};

export const deleteRepair = async (
  req: AuthRequest<IdParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyConnection = await dbManager.getCompanyConnection(req.user!.companyName);
    const RepairModel = createRepairModel(companyConnection);

    const repair = await RepairModel.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user!.companyId
    });

    if (!repair) {
      res.status(404).json({
        success: false,
        message: 'Repair ticket not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Repair ticket deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting repair:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete repair ticket'
    });
  }
};

export const completeRepair = async (
  req: AuthRequest<IdParams, any, { cost?: number; notes?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyConnection = await dbManager.getCompanyConnection(req.user!.companyName);
    const RepairModel = createRepairModel(companyConnection);

    const updateData: any = {
      status: 'Complete',
      dateCompleted: new Date(),
      updatedBy: req.user!.userId
    };

    if (req.body.cost !== undefined) {
      updateData.cost = req.body.cost;
    }
    if (req.body.notes) {
      updateData.notes = req.body.notes;
    }

    const repair = await RepairModel.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user!.companyId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!repair) {
      res.status(404).json({
        success: false,
        message: 'Repair ticket not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Repair completed successfully',
      data: repair
    });
  } catch (error: any) {
    console.error('Error completing repair:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete repair'
    });
  }
};