import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import dbManager from '../../config/database';
import { createAssetModel } from '../../models';
import { AuthRequest, AssetRequest, AssetQuery, ApiResponse, IAsset } from '../../types';

interface AssetStatsResponse {
  statusStats: Array<{ _id: string; count: number; totalValue: number }>;
  categoryStats: Array<{ _id: string; count: number }>;
  totalAssets: number;
  totalValue: number;
}

interface PaginatedAssetResponse {
  assets: IAsset[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class AssetController {
  async getAllAssets(req: AuthRequest, res: Response<ApiResponse<PaginatedAssetResponse>>): Promise<void> {
    try {
      const { companyName } = req.user!;
      
      const companyConnection = await dbManager.getCompanyConnection(companyName);
      const AssetModel = createAssetModel(companyConnection);

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const filter: any = {};
      if (req.query.status) filter.status = req.query.status;
      if (req.query.category) filter.category = req.query.category;
      if (req.query.search) {
        filter.$or = [
          { name: { $regex: req.query.search, $options: 'i' } },
          { serialNumber: { $regex: req.query.search, $options: 'i' } },
          { vendor: { $regex: req.query.search, $options: 'i' } }
        ];
      }

      const [assets, total] = await Promise.all([
        AssetModel.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        AssetModel.countDocuments(filter)
      ]);

      res.json({
        success: true,
        data: {
          assets: assets as IAsset[],
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error: any) {
      console.error('Get assets error:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to fetch assets'
      });
    }
  }

  async getAssetById(req: AuthRequest<{ id: string }>, res: Response<ApiResponse<IAsset>>): Promise<void> {
    try {
      const { companyName } = req.user!;
      const { id } = req.params;

      const companyConnection = await dbManager.getCompanyConnection(companyName);
      const AssetModel = createAssetModel(companyConnection);

      const asset = await AssetModel.findById(id).lean();

      if (!asset) {
        res.status(404).json({
          success: false,
          message: 'Asset not found'
        });
        return;
      }

      res.json({
        success: true,
        data: asset as IAsset
      });

    } catch (error: any) {
      console.error('Get asset error:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to fetch asset'
      });
    }
  }

  async createAsset(req: AuthRequest<{}, ApiResponse<IAsset>, AssetRequest>, res: Response<ApiResponse<IAsset>>): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(err => ({
            field: 'param' in err ? String((err as any).param) : ('type' in err ? String((err as any).type) : 'unknown'),
            message: err.msg
          }))
        });
        return;
      }

      const { companyName } = req.user!;
      
      const companyConnection = await dbManager.getCompanyConnection(companyName);
      const AssetModel = createAssetModel(companyConnection);

      const asset = new AssetModel(req.body);
      await asset.save();

      res.status(201).json({
        success: true,
        message: 'Asset created successfully',
        data: asset
      });

    } catch (error: any) {
      console.error('Create asset error:', error);
      
      if (error.code === 11000) {
        res.status(409).json({
          success: false,
          message: 'Serial number already exists'
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Unable to create asset'
      });
    }
  }

  async updateAsset(req: AuthRequest<{ id: string }, ApiResponse<IAsset>, AssetRequest>, res: Response<ApiResponse<IAsset>>): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(err => ({
            field: 'param' in err ? String((err as any).param) : ('type' in err ? String((err as any).type) : 'unknown'),
            message: err.msg
          }))
        });
        return;
      }

      const { companyName } = req.user!;
      const { id } = req.params;

      const companyConnection = await dbManager.getCompanyConnection(companyName);
      const AssetModel = createAssetModel(companyConnection);

      const asset = await AssetModel.findByIdAndUpdate(
        id,
        { ...req.body, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!asset) {
        res.status(404).json({
          success: false,
          message: 'Asset not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Asset updated successfully',
        data: asset
      });

    } catch (error: any) {
      console.error('Update asset error:', error);

      if (error.code === 11000) {
        res.status(409).json({
          success: false,
          message: 'Serial number already exists'
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Unable to update asset'
      });
    }
  }

  async deleteAsset(req: AuthRequest<{ id: string }>, res: Response): Promise<void> {
    try {
      const { companyName } = req.user!;
      const { id } = req.params;

      const companyConnection = await dbManager.getCompanyConnection(companyName);
      const AssetModel = createAssetModel(companyConnection);

      const asset = await AssetModel.findByIdAndDelete(id);

      if (!asset) {
        res.status(404).json({
          success: false,
          message: 'Asset not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Asset deleted successfully'
      });

    } catch (error: any) {
      console.error('Delete asset error:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to delete asset'
      });
    }
  }

  async getAssetStats(req: AuthRequest, res: Response<ApiResponse<AssetStatsResponse>>): Promise<void> {
    try {
      const { companyName } = req.user!;
      
      const companyConnection = await dbManager.getCompanyConnection(companyName);
      const AssetModel = createAssetModel(companyConnection);

      const [stats, categoryStats, totalAssets, totalValueResult] = await Promise.all([
        AssetModel.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              totalValue: { $sum: '$purchasePrice' }
            }
          }
        ]),
        AssetModel.aggregate([
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          }
        ]),
        AssetModel.countDocuments(),
        AssetModel.aggregate([
          { $group: { _id: null, total: { $sum: '$purchasePrice' } } }
        ])
      ]);

      res.json({
        success: true,
        data: {
          statusStats: stats,
          categoryStats,
          totalAssets,
          totalValue: totalValueResult[0]?.total || 0
        }
      });

    } catch (error: any) {
      console.error('Get asset stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to fetch asset statistics'
      });
    }
  }

  async bulkUpdateAssets(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { companyName } = req.user!;
      const { assetIds, updates } = req.body;

      if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Asset IDs are required'
        });
        return;
      }

      const companyConnection = await dbManager.getCompanyConnection(companyName);
      const AssetModel = createAssetModel(companyConnection);

      const result = await AssetModel.updateMany(
        { _id: { $in: assetIds } },
        { ...updates, updatedAt: new Date() }
      );

      res.json({
        success: true,
        message: `${result.modifiedCount} assets updated successfully`
      });

    } catch (error: any) {
      console.error('Bulk update assets error:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to update assets'
      });
    }
  }

  async bulkDeleteAssets(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { companyName } = req.user!;
      const { assetIds } = req.body;

      if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Asset IDs are required'
        });
        return;
      }

      const companyConnection = await dbManager.getCompanyConnection(companyName);
      const AssetModel = createAssetModel(companyConnection);

      const result = await AssetModel.deleteMany({
        _id: { $in: assetIds }
      });

      res.json({
        success: true,
        message: `${result.deletedCount} assets deleted successfully`
      });

    } catch (error: any) {
      console.error('Bulk delete assets error:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to delete assets'
      });
    }
  }

  async exportAssets(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { companyName } = req.user!;
      
      const companyConnection = await dbManager.getCompanyConnection(companyName);
      const AssetModel = createAssetModel(companyConnection);

      const filter: any = {};
      if (req.query.status) filter.status = req.query.status;
      if (req.query.category) filter.category = req.query.category;
      if (req.query.search) {
        filter.$or = [
          { name: { $regex: req.query.search, $options: 'i' } },
          { serialNumber: { $regex: req.query.search, $options: 'i' } },
          { vendor: { $regex: req.query.search, $options: 'i' } }
        ];
      }

      const assets = await AssetModel.find(filter)
        .sort({ createdAt: -1 })
        .lean();

      const headers = [
        'Name',
        'Serial Number',
        'Category',
        'Status',
        'Condition',
        'Vendor',
        'Purchase Date',
        'Purchase Price',
        'Location',
        'Assigned To',
        'Notes',
        'Created At'
      ];

      const csvRows = assets.map(asset => [
        `"${asset.name}"`,
        `"${asset.serialNumber}"`,
        `"${asset.category}"`,
        `"${asset.status}"`,
        `"${asset.condition}"`,
        `"${asset.vendor}"`,
        `"${new Date(asset.purchaseDate).toLocaleDateString()}"`,
        `"${asset.purchasePrice}"`,
        `"${asset.location}"`,
        `"${asset.assignedTo || ''}"`,
        `"${asset.notes || ''}"`,
        `"${new Date(asset.createdAt).toLocaleDateString()}"`
      ]);

      const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="assets_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvContent);

    } catch (error: any) {
      console.error('Export assets error:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to export assets'
      });
    }
  }

  async getAssetCategories(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { companyName } = req.user!;
      
      const companyConnection = await dbManager.getCompanyConnection(companyName);
      const AssetModel = createAssetModel(companyConnection);

      const categories = await AssetModel.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalValue: { $sum: '$purchasePrice' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      res.json({
        success: true,
        data: categories
      });

    } catch (error: any) {
      console.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to fetch categories'
      });
    }
  }
}

export default new AssetController();