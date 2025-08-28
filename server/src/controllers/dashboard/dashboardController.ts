import { Request, Response } from 'express';
import { AuthRequest } from '../../types';
import dbManager from '../../config/database';
import { createAssetModel, createAssignmentModel, createRepairModel, createInvoiceModel } from '../../models';

interface DashboardStats {
  totalAssets: number;
  assignedItems: number;
  underRepair: number;
  lowStockAlerts: number;
  assetDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  assignmentTrends: Array<{
    month: string;
    newAssignments: number;
    returns: number;
  }>;
  recentActivity: Array<{
    id: string;
    text: string;
    time: string;
    color: string;
  }>;
  alerts: Array<{
    id: string;
    type: 'critical' | 'warning' | 'info';
    title: string;
    message: string;
  }>;
}

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { companyName } = req.user!;
    
    const companyConnection = await dbManager.getCompanyConnection(companyName);
    const AssetModel = createAssetModel(companyConnection);
    const AssignmentModel = createAssignmentModel(companyConnection);
    const RepairModel = createRepairModel(companyConnection);
    const InvoiceModel = createInvoiceModel(companyConnection);

    const totalAssets = await AssetModel.countDocuments();
    const assignedItems = await AssetModel.countDocuments({ status: 'Assigned' });
    const underRepair = await AssetModel.countDocuments({ status: 'Under Repair' });
    
    const assetsByCategory = await AssetModel.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const lowStockAlerts = assetsByCategory.filter(cat => cat.count < 5).length;

    const categoryColors = {
      'Computers & Laptops': '#3b82f6',
      'Monitors & Displays': '#10b981',
      'Mobile Devices': '#f59e0b',
      'Network Equipment': '#ef4444',
      'Office Equipment': '#8b5cf6',
      'Other': '#6b7280'
    };

    const assetDistribution = assetsByCategory.map(item => ({
      name: item._id,
      value: item.count,
      color: categoryColors[item._id as keyof typeof categoryColors] || '#6b7280'
    }));

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const assignmentTrends = await AssignmentModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          newAssignments: { $sum: 1 },
          returns: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Returned'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $project: {
          month: {
            $dateToString: {
              format: '%b %Y',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month'
                }
              }
            }
          },
          newAssignments: 1,
          returns: 1
        }
      }
    ]);

    const recentAssets = await AssetModel.find()
      .sort({ updatedAt: -1 })
      .limit(2)
      .select('name assignedTo updatedAt');

    const recentRepairs = await RepairModel.find()
      .sort({ createdAt: -1 })
      .limit(1)
      .populate('assetId', 'name');

    const recentInvoices = await InvoiceModel.find()
      .sort({ createdAt: -1 })
      .limit(1)
      .select('vendor createdAt');

    const recentActivity = [
      ...recentAssets.map((asset, index) => ({
        id: `asset-${asset._id}`,
        text: asset.assignedTo 
          ? `${asset.name} assigned to ${asset.assignedTo}`
          : `${asset.name} added to inventory`,
        time: formatTimeAgo(asset.updatedAt),
        color: asset.assignedTo ? 'bg-green-500' : 'bg-blue-500'
      })),
      ...recentRepairs.map((repair: any) => ({
        id: `repair-${repair._id}`,
        text: `${repair.assetId.name} sent for repair - ${repair.issue}`,
        time: formatTimeAgo(repair.createdAt),
        color: 'bg-orange-500'
      })),
      ...recentInvoices.map((invoice: any )=> ({
        id: `invoice-${invoice._id}`,
        text: `New invoice from ${invoice.vendor}`,
        time: formatTimeAgo(invoice.createdAt),
        color: 'bg-purple-500'
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4);

    const alerts = [];
    
    const criticalStockCategories = assetsByCategory.filter(cat => cat.count < 3);
    if (criticalStockCategories.length > 0) {
      alerts.push({
        id: 'critical-stock',
        type: 'critical' as const,
        title: 'Critical Stock Alert',
        message: `${criticalStockCategories[0]._id} running low (${criticalStockCategories[0].count} remaining)`
      });
    }

    const overdueAssignments = await AssignmentModel.countDocuments({
      status: 'Active',
      expectedReturnDate: { $lt: new Date() }
    });
    
    if (overdueAssignments > 0) {
      alerts.push({
        id: 'overdue-returns',
        type: 'warning' as const,
        title: 'Overdue Returns',
        message: `${overdueAssignments} items past return date`
      });
    }

    const completedRepairs = await RepairModel.countDocuments({
      status: 'Complete',
      updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
    });

    if (completedRepairs > 0) {
      alerts.push({
        id: 'repair-updates',
        type: 'info' as const,
        title: 'Repair Updates',
        message: `${completedRepairs} items ready for pickup`
      });
    }

    const dashboardStats: DashboardStats = {
      totalAssets,
      assignedItems,
      underRepair,
      lowStockAlerts,
      assetDistribution,
      assignmentTrends,
      recentActivity,
      alerts
    };

    res.json({
      success: true,
      data: dashboardStats
    });

  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
}