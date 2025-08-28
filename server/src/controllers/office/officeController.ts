import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import dbManager from '../../config/database';
import createOfficeModel, { IOffice } from '../../models/Office';
import { ApiResponse } from '../../types';

class OfficeController {
  async getOffices(req: Request, res: Response<ApiResponse<IOffice[]>>): Promise<void> {
    try {
      const authReq = req as any;
      const { companyId } = authReq.user;

      const mainConnection = await dbManager.getMainConnection();
      const CompanyModel = require('../../models').createCompanyModel(mainConnection);
      const company = await CompanyModel.findById(companyId);

      if (!company) {
        res.status(404).json({
          success: false,
          message: 'Company not found'
        });
        return;
      }

      const companyConnection = await dbManager.getCompanyConnection(company.name);
      const OfficeModel = createOfficeModel(companyConnection);

      const offices = await OfficeModel.find().sort({ isMain: -1, createdAt: 1 });

      res.json({
        success: true,
        message: 'Offices retrieved successfully',
        data: offices
      });

    } catch (error: any) {
      console.error('Get offices error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve offices'
      });
    }
  }

  async createOffice(req: Request, res: Response<ApiResponse<IOffice>>): Promise<void> {
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

      const authReq = req as any;
      const { companyId } = authReq.user;

      const mainConnection = await dbManager.getMainConnection();
      const CompanyModel = require('../../models').createCompanyModel(mainConnection);
      const company = await CompanyModel.findById(companyId);

      if (!company) {
        res.status(404).json({
          success: false,
          message: 'Company not found'
        });
        return;
      }

      const companyConnection = await dbManager.getCompanyConnection(company.name);
      const OfficeModel = createOfficeModel(companyConnection);

      const existingOffice = await OfficeModel.findOne({ code: req.body.code });
      if (existingOffice) {
        res.status(409).json({
          success: false,
          message: 'Office code already exists'
        });
        return;
      }

      const office = new OfficeModel({
        ...req.body,
        isMain: false
      });

      await office.save();

      res.status(201).json({
        success: true,
        message: 'Office created successfully',
        data: office
      });

    } catch (error: any) {
      console.error('Create office error:', error);
      
      if (error.code === 11000) {
        res.status(409).json({
          success: false,
          message: 'Office code already exists'
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Failed to create office'
      });
    }
  }

  async updateOffice(req: Request, res: Response<ApiResponse<IOffice>>): Promise<void> {
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

      const { id } = req.params;
      const authReq = req as any;
      const { companyId } = authReq.user;

      const mainConnection = await dbManager.getMainConnection();
      const CompanyModel = require('../../models').createCompanyModel(mainConnection);
      const company = await CompanyModel.findById(companyId);

      if (!company) {
        res.status(404).json({
          success: false,
          message: 'Company not found'
        });
        return;
      }

      const companyConnection = await dbManager.getCompanyConnection(company.name);
      const OfficeModel = createOfficeModel(companyConnection);

      const office = await OfficeModel.findById(id);
      if (!office) {
        res.status(404).json({
          success: false,
          message: 'Office not found'
        });
        return;
      }

      const updateData = { ...req.body };
      if ('isMain' in updateData) {
        delete updateData.isMain;
      }

      if (updateData.code && updateData.code !== office.code) {
        const existingOffice = await OfficeModel.findOne({ 
          code: updateData.code, 
          _id: { $ne: id } 
        });
        
        if (existingOffice) {
          res.status(409).json({
            success: false,
            message: 'Office code already exists'
          });
          return;
        }
      }

      const updatedOffice = await OfficeModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedOffice) {
        res.status(404).json({
          success: false,
          message: 'Office not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Office updated successfully',
        data: updatedOffice
      });

    } catch (error: any) {
      console.error('Update office error:', error);
      
      if (error.code === 11000) {
        res.status(409).json({
          success: false,
          message: 'Office code already exists'
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update office'
      });
    }
  }

  async deleteOffice(req: Request, res: Response<ApiResponse<null>>): Promise<void> {
    try {
      const { id } = req.params;
      const authReq = req as any;
      const { companyId } = authReq.user;

      const mainConnection = await dbManager.getMainConnection();
      const CompanyModel = require('../../models').createCompanyModel(mainConnection);
      const company = await CompanyModel.findById(companyId);

      if (!company) {
        res.status(404).json({
          success: false,
          message: 'Company not found'
        });
        return;
      }

      const companyConnection = await dbManager.getCompanyConnection(company.name);
      const OfficeModel = createOfficeModel(companyConnection);

      const office = await OfficeModel.findById(id);
      if (!office) {
        res.status(404).json({
          success: false,
          message: 'Office not found'
        });
        return;
      }

      if (office.isMain) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete main office'
        });
        return;
      }

      await OfficeModel.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Office deleted successfully',
        data: null
      });

    } catch (error: any) {
      console.error('Delete office error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete office'
      });
    }
  }

  async getOffice(req: Request, res: Response<ApiResponse<IOffice>>): Promise<void> {
    try {
      const { id } = req.params;
      const authReq = req as any;
      const { companyId } = authReq.user;

      const mainConnection = await dbManager.getMainConnection();
      const CompanyModel = require('../../models').createCompanyModel(mainConnection);
      const company = await CompanyModel.findById(companyId);

      if (!company) {
        res.status(404).json({
          success: false,
          message: 'Company not found'
        });
        return;
      }

      const companyConnection = await dbManager.getCompanyConnection(company.name);
      const OfficeModel = createOfficeModel(companyConnection);

      const office = await OfficeModel.findById(id);
      if (!office) {
        res.status(404).json({
          success: false,
          message: 'Office not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Office retrieved successfully',
        data: office
      });

    } catch (error: any) {
      console.error('Get office error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve office'
      });
    }
  }
}

export const { getOffices, createOffice, updateOffice, deleteOffice, getOffice } = new OfficeController();