import { Response } from 'express';
import { AuthRequest } from '../../types';
import dbManager from '../../config/database';
import { createReportModel } from '../../models/Report';
import createAssetModel from '../../models/Asset';
import createUserModel from '../../models/User';
import * as XLSX from 'xlsx';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const getReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, type, status, search } = req.query;
    
    const companyConnection = await dbManager.getCompanyConnection(req.user!.companyName);
    const ReportModel = createReportModel(companyConnection);

    const query: any = { companyId: req.user!.companyId };
    
    if (type && type !== 'All Types') {
      query.type = type;
    }
    
    if (status && status !== 'All Statuses') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const reports = await ReportModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit));

    const total = await ReportModel.countDocuments(query);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit)
        }
      }
    });
  } catch (error: any) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports'
    });
  }
};

export const getReportStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const companyConnection = await dbManager.getCompanyConnection(req.user!.companyName);
    const ReportModel = createReportModel(companyConnection);

    const stats = await ReportModel.aggregate([
      { $match: { companyId: req.user!.companyId } },
      {
        $group: {
          _id: null,
          totalReports: { $sum: 1 },
          generated: {
            $sum: { $cond: [{ $eq: ['$status', 'Generated'] }, 1, 0] }
          },
          generating: {
            $sum: { $cond: [{ $eq: ['$status', 'Generating'] }, 1, 0] }
          },
          failed: {
            $sum: { $cond: [{ $eq: ['$status', 'Failed'] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalReports: 0,
      generated: 0,
      generating: 0,
      failed: 0
    };

    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);

    const thisMonthCount = await ReportModel.countDocuments({
      companyId: req.user!.companyId,
      createdAt: { $gte: thisMonthStart }
    });

    res.json({
      success: true,
      data: {
        ...result,
        thisMonthCount,
        successRate: result.totalReports > 0 ? Math.round((result.generated / result.totalReports) * 100) : 0
      }
    });
  } catch (error: any) {
    console.error('Get report stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report statistics'
    });
  }
};

export const generateReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, name, description, format, dateRange, filters } = req.body;

    const companyConnection = await dbManager.getCompanyConnection(req.user!.companyName);
    const ReportModel = createReportModel(companyConnection);
    const UserModel = createUserModel(companyConnection);

    const user = await UserModel.findById(req.user!.userId);
    
    const report = await ReportModel.create({
      name,
      type,
      description,
      format,
      generatedBy: user?.email || 'Unknown User',
      status: 'Generating',
      config: {
        dateRange: {
          start: new Date(dateRange.start),
          end: new Date(dateRange.end)
        },
        filters
      },
      companyId: req.user!.companyId
    });

    res.status(201).json({
      success: true,
      message: 'Report generation started',
      data: report
    });

    generateReportFile(report._id.toString(), req.user!.companyName, req.user!.companyId)
      .catch(error => {
        console.error('Report generation failed:', error);
        ReportModel.findByIdAndUpdate(report._id, { status: 'Failed' }).exec();
      });

  } catch (error: any) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start report generation'
    });
  }
};

export const downloadReport = async (req: AuthRequest & { params: { id: string } }, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const companyConnection = await dbManager.getCompanyConnection(req.user!.companyName);
    const ReportModel = createReportModel(companyConnection);

    const report = await ReportModel.findOne({
      _id: id,
      companyId: req.user!.companyId,
      status: 'Generated'
    });

    if (!report) {
      res.status(404).json({
        success: false,
        message: 'Report not found or not ready for download'
      });
      return;
    }

    if (!report.downloadUrl) {
      res.status(404).json({
        success: false,
        message: 'Report file not found'
      });
      return;
    }

    const filePath = path.join(process.cwd(), 'uploads', 'reports', report.downloadUrl);
    
    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        success: false,
        message: 'Report file not found on server'
      });
      return;
    }

    res.download(filePath, `${report.name}.${report.format.toLowerCase()}`);

  } catch (error: any) {
    console.error('Download report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download report'
    });
  }
};

export const deleteReport = async (req: AuthRequest & { params: { id: string } }, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const companyConnection = await dbManager.getCompanyConnection(req.user!.companyName);
    const ReportModel = createReportModel(companyConnection);

    const report = await ReportModel.findOneAndDelete({
      _id: id,
      companyId: req.user!.companyId
    });

    if (!report) {
      res.status(404).json({
        success: false,
        message: 'Report not found'
      });
      return;
    }

    if (report.downloadUrl) {
      const filePath = path.join(process.cwd(), 'uploads', 'reports', report.downloadUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report'
    });
  }
};

const generateReportFile = async (reportId: string, companyName: string, companyId: string) => {
  try {
    const companyConnection = await dbManager.getCompanyConnection(companyName);
    const ReportModel = createReportModel(companyConnection);
    const AssetModel = createAssetModel(companyConnection);

    const report = await ReportModel.findById(reportId);
    if (!report) return;

    const uploadDir = path.join(process.cwd(), 'uploads', 'reports');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let data: any[] = [];
    
    switch (report.type) {
      case 'Asset Utilization':
        data = await generateAssetUtilizationData(AssetModel, report.config);
        break;
      case 'Assignment History':
        break;
      case 'Repair Analytics':
        break;
      default:
        data = await generateAssetUtilizationData(AssetModel, report.config);
    }

    const fileName = `${reportId}_${Date.now()}`;
    let filePath: string;
    let fileSize: string;

    switch (report.format) {
      case 'CSV':
        filePath = await generateCSVFile(data, fileName, uploadDir);
        break;
      case 'Excel':
        filePath = await generateExcelFile(data, fileName, uploadDir);
        break;
      case 'PDF':
        filePath = await generatePDFFile(data, report.name, fileName, uploadDir);
        break;
      default:
        throw new Error('Unsupported format');
    }

    const stats = fs.statSync(filePath);
    fileSize = `${(stats.size / 1024 / 1024).toFixed(2)} MB`;

    await ReportModel.findByIdAndUpdate(reportId, {
      status: 'Generated',
      downloadUrl: path.basename(filePath),
      fileSize
    });

  } catch (error) {
    console.error('Report generation error:', error);
    throw error;
  }
};

const generateCSVFile = async (data: any[], fileName: string, uploadDir: string): Promise<string> => {
  const filePath = path.join(uploadDir, `${fileName}.csv`);
  
  if (data.length === 0) {
    fs.writeFileSync(filePath, 'No data available');
    return filePath;
  }

  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(',')).join('\n');
  const csvContent = `${headers}\n${rows}`;
  
  fs.writeFileSync(filePath, csvContent);
  return filePath;
};

const generateExcelFile = async (data: any[], fileName: string, uploadDir: string): Promise<string> => {
  const filePath = path.join(uploadDir, `${fileName}.xlsx`);
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report');
  
  XLSX.writeFile(wb, filePath);
  return filePath;
};

const generatePDFFile = async (data: any[], reportName: string, fileName: string, uploadDir: string): Promise<string> => {
  const filePath = path.join(uploadDir, `${fileName}.pdf`);
  
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(20).text(reportName, 50, 50);
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 80);

  let yPosition = 120;
  
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    doc.text(headers.join('  |  '), 50, yPosition);
    yPosition += 20;
    
    data.forEach(row => {
      const values = Object.values(row).map(val => String(val));
      doc.text(values.join('  |  '), 50, yPosition);
      yPosition += 15;
      
      if (yPosition > 750) {
        doc.addPage();
        yPosition = 50;
      }
    });
  } else {
    doc.text('No data available', 50, yPosition);
  }

  doc.end();
  
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};

const generateAssetUtilizationData = async (AssetModel: any, config: any) => {
  const query: any = {};
  
  if (config.filters.category) {
    query.category = config.filters.category;
  }
  
  if (config.filters.office) {
    query.location = config.filters.office;
  }

  const assets = await AssetModel.find(query);
  
  return assets.map((asset: any) => ({
    'Asset Name': asset.name,
    'Category': asset.category,
    'Serial Number': asset.serialNumber,
    'Status': asset.status,
    'Location': asset.location,
    'Purchase Date': asset.purchaseDate.toLocaleDateString(),
    'Purchase Price': `$${asset.purchasePrice}`,
    'Assigned To': asset.assignedTo || 'Unassigned'
  }));
};