import { Response } from 'express';
import { AuthRequest } from '../../types';
import { createInvoiceModel, IInvoice } from '../../models/Invoice';
import dbManager from '../../config/database';

class InvoiceController {
  async getInvoices(req: AuthRequest, res: Response) {
    try {
      const { companyName } = req.user!;
      const connection = await dbManager.getCompanyConnection(companyName);
      const Invoice = createInvoiceModel(connection);

      const {
        page = 1,
        limit = 20,
        status,
        vendor,
        search
      } = req.query;

      const query: any = { companyId: req.user!.companyId };

      if (status) query.status = status;
      if (vendor) query.vendor = { $regex: vendor, $options: 'i' };
      if (search) {
        query.$or = [
          { invoiceNumber: { $regex: search, $options: 'i' } },
          { vendor: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [invoices, total] = await Promise.all([
        Invoice.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        Invoice.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / Number(limit));

      res.json({
        success: true,
        data: {
          invoices,
          pagination: {
            currentPage: Number(page),
            totalPages,
            totalItems: total,
            hasNextPage: Number(page) < totalPages,
            hasPrevPage: Number(page) > 1
          }
        }
      });
    } catch (error) {
      console.error('Get invoices error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve invoices'
      });
    }
  }

  async getInvoice(req: AuthRequest & { params: { id: string } }, res: Response) {
    try {
      const { companyName } = req.user!;
      const connection = await dbManager.getCompanyConnection(companyName);
      const Invoice = createInvoiceModel(connection);

      const invoice = await Invoice.findOne({
        _id: req.params.id,
        companyId: req.user!.companyId
      }).lean();

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }

      res.json({
        success: true,
        data: invoice
      });
    } catch (error) {
      console.error('Get invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve invoice'
      });
    }
  }

  async createInvoice(req: AuthRequest, res: Response) {
    try {
      const { companyName, userId, companyId } = req.user!;
      const connection = await dbManager.getCompanyConnection(companyName);
      const Invoice = createInvoiceModel(connection);

      const invoiceData = {
        ...req.body,
        companyId,
        createdBy: userId,
        issueDate: new Date(req.body.issueDate),
        dueDate: new Date(req.body.dueDate)
      };

      const invoice = new Invoice(invoiceData);
      await invoice.save();

      res.status(201).json({
        success: true,
        message: 'Invoice created successfully',
        data: invoice
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Create invoice error:', error.message);
        if ((error as any).code === 11000) {
          return res.status(409).json({
            success: false,
            message: 'Invoice number already exists'
          });
        }
      } else {
        console.error('Create invoice error:', error);
      }
      res.status(500).json({
        success: false,
        message: 'Failed to create invoice'
      });
    }
  }

  async updateInvoice(req: AuthRequest & { params: { id: string } }, res: Response) {
    try {
      const { companyName } = req.user!;
      const connection = await dbManager.getCompanyConnection(companyName);
      const Invoice = createInvoiceModel(connection);

      const updateData = { ...req.body };
      
      if (updateData.issueDate) updateData.issueDate = new Date(updateData.issueDate);
      if (updateData.dueDate) updateData.dueDate = new Date(updateData.dueDate);
      if (updateData.paidDate) updateData.paidDate = new Date(updateData.paidDate);

      const invoice = await Invoice.findOneAndUpdate(
        {
          _id: req.params.id,
          companyId: req.user!.companyId
        },
        updateData,
        { new: true, runValidators: true }
      );

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }

      res.json({
        success: true,
        message: 'Invoice updated successfully',
        data: invoice
      });
    } catch (error) {
      console.error('Update invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update invoice'
      });
    }
  }

  async deleteInvoice(req: AuthRequest & { params: { id: string } }, res: Response) {
    try {
      const { companyName } = req.user!;
      const connection = await dbManager.getCompanyConnection(companyName);
      const Invoice = createInvoiceModel(connection);

      const invoice = await Invoice.findOneAndDelete({
        _id: req.params.id,
        companyId: req.user!.companyId
      });

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }

      res.json({
        success: true,
        message: 'Invoice deleted successfully'
      });
    } catch (error) {
      console.error('Delete invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete invoice'
      });
    }
  }

  async markPaid(req: AuthRequest & { params: { id: string } }, res: Response) {
    try {
      const { companyName } = req.user!;
      const connection = await dbManager.getCompanyConnection(companyName);
      const Invoice = createInvoiceModel(connection);

      const invoice = await Invoice.findOneAndUpdate(
        {
          _id: req.params.id,
          companyId: req.user!.companyId,
          status: { $in: ['Pending', 'Overdue'] }
        },
        {
          status: 'Paid',
          paidDate: new Date()
        },
        { new: true }
      );

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found or already paid'
        });
      }

      res.json({
        success: true,
        message: 'Invoice marked as paid successfully',
        data: invoice
      });
    } catch (error) {
      console.error('Mark paid error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark invoice as paid'
      });
    }
  }

  async getInvoiceStats(req: AuthRequest, res: Response) {
    try {
      const { companyName, companyId } = req.user!;
      const connection = await dbManager.getCompanyConnection(companyName);
      const Invoice = createInvoiceModel(connection);

      const stats = await Invoice.aggregate([
        { $match: { companyId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' }
          }
        }
      ]);

      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const monthlyStats = await Invoice.aggregate([
        {
          $match: {
            companyId,
            createdAt: { $gte: currentMonth }
          }
        },
        {
          $group: {
            _id: null,
            totalInvoices: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' }
          }
        }
      ]);

      const processedStats = {
        totalInvoices: 0,
        totalAmount: 0,
        pendingAmount: 0,
        overdueAmount: 0,
        paidAmount: 0,
        monthlyInvoices: monthlyStats[0]?.totalInvoices || 0,
        monthlyAmount: monthlyStats[0]?.totalAmount || 0
      };

      stats.forEach(stat => {
        switch (stat._id) {
          case 'Pending':
            processedStats.pendingAmount = stat.totalAmount;
            break;
          case 'Overdue':
            processedStats.overdueAmount = stat.totalAmount;
            break;
          case 'Paid':
            processedStats.paidAmount = stat.totalAmount;
            break;
        }
        processedStats.totalInvoices += stat.count;
        processedStats.totalAmount += stat.totalAmount;
      });

      res.json({
        success: true,
        data: processedStats
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve invoice statistics'
      });
    }
  }

  async bulkDelete(req: AuthRequest, res: Response) {
    try {
      const { companyName } = req.user!;
      const connection = await dbManager.getCompanyConnection(companyName);
      const Invoice = createInvoiceModel(connection);

      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invoice IDs are required'
        });
      }

      const result = await Invoice.deleteMany({
        _id: { $in: ids },
        companyId: req.user!.companyId
      });

      res.json({
        success: true,
        message: `${result.deletedCount} invoices deleted successfully`,
        data: { deletedCount: result.deletedCount }
      });
    } catch (error) {
      console.error('Bulk delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete invoices'
      });
    }
  }
}

export default new InvoiceController();