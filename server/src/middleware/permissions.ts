import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

export const PERMISSIONS = {
  VENDORS_READ: 'vendors:read',
  VENDORS_WRITE: 'vendors:write',
  VENDORS_DELETE: 'vendors:delete',
  ASSETS_READ: 'assets:read',
  ASSETS_WRITE: 'assets:write',
  ASSETS_DELETE: 'assets:delete',
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_DELETE: 'users:delete',
  REPORTS_READ: 'reports:read',
  SETTINGS_READ: 'settings:read',
  SETTINGS_WRITE: 'settings:write'
} as const;

const ROLE_PERMISSIONS = {
  admin: [
    PERMISSIONS.VENDORS_READ,
    PERMISSIONS.VENDORS_WRITE,
    PERMISSIONS.VENDORS_DELETE,
    PERMISSIONS.ASSETS_READ,
    PERMISSIONS.ASSETS_WRITE,
    PERMISSIONS.ASSETS_DELETE,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_WRITE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.SETTINGS_WRITE
  ],
  user: [
    PERMISSIONS.VENDORS_READ,
    PERMISSIONS.ASSETS_READ,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.REPORTS_READ
  ]
};

export const checkPermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
    
    if (!userPermissions.includes(permission as any)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

export const checkAllPermissions = (...permissions: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
    const hasAllPermissions = permissions.every(permission => 
      userPermissions.includes(permission as any)
    );
    
    if (!hasAllPermissions) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

export const checkAnyPermission = (...permissions: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
    const hasAnyPermission = permissions.some(permission => 
      userPermissions.includes(permission as any)
    );
    
    if (!hasAnyPermission) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

export const getUserPermissions = (role: string): string[] => {
  return ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || [];
};