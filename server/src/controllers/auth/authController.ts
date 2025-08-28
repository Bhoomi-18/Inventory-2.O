import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import dbManager from '../../config/database';
import { createCompanyModel, createUserModel } from '../../models';
import createOfficeModel from '../../models/Office';
import Role from '../../models/Role';
import { 
  ApiResponse, 
  AuthResponse, 
  LoginRequest, 
  SignupRequest, 
  JWTPayload,
  ICompany,
  IUser
} from '../../types';

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

class AuthController {
  private generateToken(userId: string, companyId: string, role: string): string {
    const payload: JWTPayload = { userId, companyId, role: role as any };
    return jwt.sign(
      payload,
      process.env.JWT_SECRET as Secret,
      { expiresIn: process.env.JWT_EXPIRE || '7d' } as SignOptions
    );
  }

  async signup(req: Request<{}, ApiResponse<AuthResponse>, SignupRequest>, res: Response<ApiResponse<AuthResponse>>): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(err => ({
            field: 'path' in err ? String(err.path) : 'unknown',
            message: err.msg
          }))
        });
        return;
      }

      const { companyName, adminEmail, adminPassword, generalPassword } = req.body;

      const mainConnection = await dbManager.getMainConnection();
      const CompanyModel = createCompanyModel(mainConnection);

      const existingCompanyByName = await CompanyModel.findOne({ 
        name: { $regex: new RegExp(`^${companyName}$`, 'i') }
      });
      
      if (existingCompanyByName) {
        res.status(409).json({
          success: false,
          message: 'Company name already exists. Please choose a different name.'
        });
        return;
      }

      const existingCompanyByEmail = await CompanyModel.findOne({
        adminEmail: adminEmail.toLowerCase()
      });
      
      if (existingCompanyByEmail) {
        res.status(409).json({
          success: false,
          message: 'Email already registered. Please use a different email.'
        });
        return;
      }

      const databaseName = dbManager.sanitizeDbName(companyName);

      const company: ICompany = new CompanyModel({
        name: companyName,
        adminEmail: adminEmail.toLowerCase(),
        adminPassword,
        generalPassword,
        databaseName
      });

      await company.save();

      const companyConnection = await dbManager.getCompanyConnection(companyName);
      const UserModel = createUserModel(companyConnection);

      const adminUser: IUser = new UserModel({
        email: adminEmail.toLowerCase(),
        companyId: company._id.toString(),
        companyName: company.name,
        role: 'admin',
        lastLogin: new Date()
      });

      await adminUser.save();

      try {
        const allPermissions = [
          'assets',
          'assignments',
          'repairs',
          'vendors',
          'users',
          'reports',
          'settings',
          'invoices',
          'offices',
        ];
        const RoleModel = Role(companyConnection);
        await RoleModel.create({
          name: 'Admin',
          permissions: allPermissions,
          companyId: company._id,
        });

        const OfficeModel = createOfficeModel(companyConnection);
        const mainOffice = new OfficeModel({
          name: 'Main Office',
          code: 'MAIN',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          },
          contactInfo: {
            email: adminEmail.toLowerCase()
          },
          manager: '',
          totalAssets: 0,
          assignedAssets: 0,
          availableAssets: 0,
          employees: 1,
          status: 'Active',
          isMain: true
        });

        await mainOffice.save();
      } catch (roleOrOfficeError) {
        console.warn('Warning: Could not create default role or office:', roleOrOfficeError);
      }

      const token = this.generateToken(adminUser._id.toString(), company._id.toString(), 'admin');

      res.status(201).json({
        success: true,
        message: 'Company registered successfully',
        data: {
          token,
          user: {
            _id: adminUser._id,
            email: adminUser.email,
            companyId: adminUser.companyId,
            companyName: adminUser.companyName,
            role: adminUser.role,
            isActive: adminUser.isActive,
            lastLogin: adminUser.lastLogin,
            createdAt: adminUser.createdAt,
            updatedAt: adminUser.updatedAt
          } as IUser,
          company: {
            id: company._id,
            name: company.name,
            adminEmail: company.adminEmail,
            createdAt: company.createdAt,
            isActive: company.isActive
          }
        }
      });

    } catch (error: any) {
      console.error('Signup error:', error);
      
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue || {})[0];
        const message = field === 'name' 
          ? 'Company name already exists' 
          : 'Email already registered';
        
        res.status(409).json({
          success: false,
          message
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Registration failed. Please try again.'
      });
    }
  }

  async login(req: Request<{}, ApiResponse<AuthResponse>, LoginRequest>, res: Response<ApiResponse<AuthResponse>>): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(err => ({
            field: 'path' in err ? String(err.path) : 'unknown',
            message: err.msg
          }))
        });
        return;
      }

      const { email, password } = req.body;

      const mainConnection = await dbManager.getMainConnection();
      const CompanyModel = createCompanyModel(mainConnection);

      let company = await CompanyModel.findOne({
        adminEmail: email.toLowerCase(),
        isActive: true
      });

      let isAdminLogin = !!company;
      let isValidPassword = false;
      let userRole: 'admin' | 'user' = 'user';

      if (company) {
        isValidPassword = await company.compareAdminPassword(password);
        userRole = 'admin';
      } else {
        const allCompanies = await CompanyModel.find({ isActive: true });
        
        for (const comp of allCompanies) {
          const isGeneralPasswordValid = await comp.compareGeneralPassword(password);
          if (isGeneralPasswordValid) {
            const companyConnection = await dbManager.getCompanyConnection(comp.name);
            const UserModel = createUserModel(companyConnection);
            const existingUser = await UserModel.findOne({ 
              email: email.toLowerCase(),
              isActive: true 
            });
            
            if (existingUser) {
              company = comp;
              isValidPassword = true;
              userRole = 'user';
              break;
            }
          }
        }

        if (!company) {
          for (const comp of allCompanies) {
            const isGeneralPasswordValid = await comp.compareGeneralPassword(password);
            if (isGeneralPasswordValid) {
              company = comp;
              isValidPassword = true;
              userRole = 'user';
              break;
            }
          }
        }
      }

      if (!company || !isValidPassword) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }

      const companyConnection = await dbManager.getCompanyConnection(company.name);
      const UserModel = createUserModel(companyConnection);

      let user = await UserModel.findOne({ 
        email: email.toLowerCase(),
        isActive: true 
      });

      if (user) {
        user.lastLogin = new Date();
        await user.save();
      } else {
        user = new UserModel({
          email: email.toLowerCase(),
          companyId: company._id.toString(),
          companyName: company.name,
          role: userRole,
          lastLogin: new Date(),
          isActive: true
        });
        await user.save();
      }

      const token = this.generateToken(user._id.toString(), company._id.toString(), user.role);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            _id: user._id,
            email: user.email,
            companyId: user.companyId,
            companyName: user.companyName,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          } as IUser,
          company: {
            id: company._id,
            name: company.name,
            adminEmail: company.adminEmail,
            createdAt: company.createdAt,
            isActive: company.isActive
          }
        }
      });

    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed. Please try again.'
      });
    }
  }

  async checkCompany(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(err => ({
            field: 'path' in err ? String(err.path) : 'unknown',
            message: err.msg
          }))
        });
        return;
      }

      const { companyName } = req.query;

      if (!companyName) {
        res.status(400).json({
          success: false,
          message: 'Company name is required'
        });
        return;
      }

      const mainConnection = await dbManager.getMainConnection();
      const CompanyModel = createCompanyModel(mainConnection);

      const existingCompany = await CompanyModel.findOne({
        name: { $regex: new RegExp(`^${companyName}$`, 'i') }
      });

      res.json({
        success: true,
        data: {
          available: !existingCompany 
        },
        message: existingCompany 
          ? 'Company name already exists' 
          : 'Company name is available'
      });

    } catch (error: any) {
      console.error('Check company error:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to check company availability'
      });
    }
  }

  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as any;
      const { userId, companyId } = authReq.user;

      const mainConnection = await dbManager.getMainConnection();
      const CompanyModel = createCompanyModel(mainConnection);
      const company = await CompanyModel.findById(companyId);

      if (!company) {
        res.status(404).json({
          success: false,
          message: 'Company not found'
        });
        return;
      }

      const companyConnection = await dbManager.getCompanyConnection(company.name);
      const UserModel = createUserModel(companyConnection);
      const user = await UserModel.findById(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          user: {
            _id: user._id,
            email: user.email,
            companyId: user.companyId,
            companyName: user.companyName,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          } as IUser,
          company: {
            id: company._id,
            name: company.name,
            adminEmail: company.adminEmail,
            createdAt: company.createdAt,
            isActive: company.isActive
          }
        }
      });

    } catch (error: any) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to fetch user data'
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }
}

export default new AuthController();