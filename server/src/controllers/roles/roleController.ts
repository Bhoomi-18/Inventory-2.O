import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import dbManager from '../../config/database';
import { createRoleModel } from '../../models';
import { AuthRequest } from '../../types';

interface RoleIdParams {
  id: string;
}

export const getRoles = async (req: AuthRequest, res: Response) => {
  try {
    const companyName = req.user?.companyName;
    if (!companyName) {
      return res.status(400).json({ success: false, message: 'Company name is required' });
    }

    const connection = await dbManager.getCompanyConnection(companyName);
    const Role = createRoleModel(connection);

    const roles = await Role.find();
    res.json({ success: true, data: roles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createRole = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const companyName = req.user?.companyName;
    if (!companyName) {
      return res.status(400).json({ success: false, message: 'Company name is required' });
    }

    const connection = await dbManager.getCompanyConnection(companyName);
    const Role = createRoleModel(connection);

    const existingRole = await Role.findOne({ name: req.body.name, companyId: companyName });
    if (existingRole) {
      return res.status(409).json({ success: false, message: 'Role already exists' });
    }

    const data = { ...req.body };
    delete data._id;
    const newRole = new Role({
      ...data,
      companyId: companyName,
    });

    await newRole.save();
    res.status(201).json({ success: true, data: newRole });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateRole = async (req: AuthRequest & { params: RoleIdParams }, res: Response) => {
  try {
    const companyName = req.user?.companyName;
    if (!companyName) {
      return res.status(400).json({ success: false, message: 'Company name is required' });
    }

    const connection = await dbManager.getCompanyConnection(companyName);
    const Role = createRoleModel(connection);

    const updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRole) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    res.json({ success: true, data: updatedRole });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteRole = async (req: AuthRequest & { params: RoleIdParams }, res: Response) => {
  try {
    const companyName = req.user?.companyName;
    if (!companyName) {
      return res.status(400).json({ success: false, message: 'Company name is required' });
    }

    const connection = await dbManager.getCompanyConnection(companyName);
    const Role = createRoleModel(connection);

    const deletedRole = await Role.findByIdAndDelete(req.params.id);
    if (!deletedRole) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    res.json({ success: true, message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
