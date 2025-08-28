import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dbManager from '../config/database';
import { createCompanyModel, createUserModel } from '../models';
import { JWTPayload, AuthRequest, UserRole } from '../types';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    const token = authHeader.substring(7); 

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
      
      const mainConnection = await dbManager.getMainConnection();
      const CompanyModel = createCompanyModel(mainConnection);
      const company = await CompanyModel.findById(decoded.companyId);

      if (!company || !company.isActive) {
        res.status(401).json({
          success: false,
          message: 'Invalid token. Company not found or inactive.'
        });
        return;
      }

      const companyConnection = await dbManager.getCompanyConnection(company.name);
      const UserModel = createUserModel(companyConnection);
      const user = await UserModel.findById(decoded.userId);

      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          message: 'Invalid token. User not found or inactive.'
        });
        return;
      }

      req.user = {
        userId: decoded.userId,
        companyId: decoded.companyId,
        role: decoded.role,
        email: user.email,
        companyName: company.name
      };

      next();
    } catch (jwtError: any) {
      res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
      return;
    }

  } catch (error: any) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
      return;
    }

    next();
  };
};