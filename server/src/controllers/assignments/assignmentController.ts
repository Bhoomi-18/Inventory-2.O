import { Request, Response } from 'express';
import dbManager from '../../config/database';
import { createAssignmentModel } from '../../models/Assignment';
import createAssetModel from '../../models/Asset';
import createUserModel from '../../models/User';
import { AuthRequest } from '../../types';
import { handleApiError } from '../../utils/errorHandler';

export const getAssignments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, status, search, sort = '-createdAt' } = req.query;
    const companyConnection = await dbManager.getCompanyConnection(req.user!.companyName);
    const AssignmentModel = createAssignmentModel(companyConnection);

    const query: any = { companyId: req.user!.companyId };
    
    if (status && status !== 'All Status') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { 'asset.name': { $regex: search, $options: 'i' } },
        { 'asset.assetId': { $regex: search, $options: 'i' } },
        { 'assignedTo.name': { $regex: search, $options: 'i' } },
        { 'assignedTo.email': { $regex: search, $options: 'i' } }
      ];
    }

    await AssignmentModel.updateMany(
      { 
        status: 'Active',
        expectedReturn: { $lt: new Date() },
        companyId: req.user!.companyId
      },
      { status: 'Overdue' }
    );

    const total = await AssignmentModel.countDocuments(query);
    const assignments = await AssignmentModel.find(query)
      .sort(sort as string)
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const stats = await getAssignmentStats(req.user!.companyId, companyConnection);

    res.json({
      success: true,
      data: {
        assignments,
        stats,
        pagination: {
          current: Number(page),
          total: Math.ceil(total / Number(limit)),
          count: assignments.length,
          totalRecords: total
        }
      }
    });

  } catch (error: any) {
    console.error('Get assignments error:', error);
    res.status(500).json({
      success: false,
      message: handleApiError(error)
    });
  }
};

export const getAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const companyConnection = await dbManager.getCompanyConnection(req.user!.companyName);
    const AssignmentModel = createAssignmentModel(companyConnection);

    const assignment = await AssignmentModel.findOne({
      _id: id,
      companyId: req.user!.companyId
    }).lean();

    if (!assignment) {
      res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
      return;
    }

    res.json({
      success: true,
      data: assignment
    });

  } catch (error: any) {
    console.error('Get assignment error:', error);
    res.status(500).json({
      success: false,
      message: handleApiError(error)
    });
  }
};

export const createAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { assetId, userId, expectedReturn, notes } = req.body;
    const companyConnection = await dbManager.getCompanyConnection(req.user!.companyName);
    const AssignmentModel = createAssignmentModel(companyConnection);
    const AssetModel = createAssetModel(companyConnection);
    const UserModel = createUserModel(companyConnection);

    const asset = await AssetModel.findOne({
      _id: assetId,
      companyId: req.user!.companyId,
      status: 'Available'
    });

    if (!asset) {
      res.status(400).json({
        success: false,
        message: 'Asset not found or not available for assignment'
      });
      return;
    }

    const user = await UserModel.findOne({
      _id: userId,
      companyId: req.user!.companyId,
      isActive: true
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'User not found or inactive'
      });
      return;
    }

    const assignment = new AssignmentModel({
      asset: {
        id: asset._id,
        name: asset.name,
        assetId: asset.serialNumber 
      },
      assignedTo: {
        id: user._id,
        name: (user as any).name ?? user.email,
        email: user.email,
        department: (user as any).department ?? 'N/A'
      },
      assignmentDate: new Date(),
      expectedReturn: new Date(expectedReturn),
      notes,
      companyId: req.user!.companyId
    });

    await assignment.save();

    await AssetModel.findByIdAndUpdate(assetId, { status: 'Assigned' });

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: assignment
    });

  } catch (error: any) {
    console.error('Create assignment error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
};

export const returnAsset = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const { notes } = req.body;
    const companyConnection = await dbManager.getCompanyConnection(req.user!.companyName);
    const AssignmentModel = createAssignmentModel(companyConnection);
    const AssetModel = createAssetModel(companyConnection);

    const assignment = await AssignmentModel.findOne({
      _id: id,
      companyId: req.user!.companyId,
      status: { $in: ['Active', 'Overdue'] }
    });

    if (!assignment) {
      res.status(404).json({
        success: false,
        message: 'Assignment not found or already returned'
      });
      return;
    }

    assignment.status = 'Returned';
    assignment.actualReturn = new Date();
    if (notes) {
      assignment.notes = assignment.notes ? `${assignment.notes}\n\nReturn Notes: ${notes}` : `Return Notes: ${notes}`;
    }
    await assignment.save();

    await AssetModel.findByIdAndUpdate(assignment.asset.id, { status: 'Available' });

    res.json({
      success: true,
      message: 'Asset returned successfully',
      data: assignment
    });

  } catch (error: any) {
    console.error('Return asset error:', error);
    res.status(500).json({
      success: false,
      message: handleApiError(error)
    });
  }
};

export const updateAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const updates = req.body;
    const companyConnection = await dbManager.getCompanyConnection(req.user!.companyName);
    const AssignmentModel = createAssignmentModel(companyConnection);

    const assignment = await AssignmentModel.findOne({
      _id: id,
      companyId: req.user!.companyId
    });

    if (!assignment) {
      res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
      return;
    }

    const allowedUpdates = ['expectedReturn', 'notes'];
    const updateData: any = {};

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = updates[key];
      }
    });

    const updatedAssignment = await AssignmentModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: 'Assignment updated successfully',
      data: updatedAssignment
    });

  } catch (error: any) {
    console.error('Update assignment error:', error);
    res.status(500).json({
      success: false,
      message: handleApiError(error)
    });
  }
};

export const deleteAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const companyConnection = await dbManager.getCompanyConnection(req.user!.companyName);
    const AssignmentModel = createAssignmentModel(companyConnection);
    const AssetModel = createAssetModel(companyConnection);

    const assignment = await AssignmentModel.findOne({
      _id: id,
      companyId: req.user!.companyId
    });

    if (!assignment) {
      res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
      return;
    }

    if (assignment.status === 'Active' || assignment.status === 'Overdue') {
      await AssetModel.findByIdAndUpdate(assignment.asset.id, { status: 'Available' });
    }

    await AssignmentModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Assignment deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete assignment error:', error);
    res.status(500).json({
      success: false,
      message: handleApiError(error)
    });
  }
};

const getAssignmentStats = async (companyId: string, connection: any) => {
  const AssignmentModel = createAssignmentModel(connection);
  
  const [activeCount, overdueCount, thisMonthCount] = await Promise.all([
    AssignmentModel.countDocuments({ companyId, status: 'Active' }),
    AssignmentModel.countDocuments({ companyId, status: 'Overdue' }),
    AssignmentModel.countDocuments({
      companyId,
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    })
  ]);

  const pendingReturns = activeCount + overdueCount;

  return {
    activeAssignments: activeCount,
    pendingReturns,
    overdueReturns: overdueCount,
    thisMonth: thisMonthCount
  };
};