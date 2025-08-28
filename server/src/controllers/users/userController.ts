import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import dbManager from '../../config/database';
import createUserModel from '../../models/User';
import { createRoleModel } from '../../models';
import { ICompany } from '../../types';
import bcrypt from 'bcrypt';

export const getUsers = async (req: any, res: Response) => {
  try {
    const companyName = req.user?.companyName;
    const connection = await dbManager.getCompanyConnection(companyName);
    const User = createUserModel(connection);
    const users = await User.find().populate('role');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createUser = async (req: any, res: Response) => {
  try {
    const companyName = req.user?.companyName;
    const connection = await dbManager.getCompanyConnection(companyName);
    const User = createUserModel(connection);
    const Role = createRoleModel(connection);

    const exists = await User.findOne({ email: req.body.email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already exists' });

    let roleObj = req.body.role;
    if (typeof roleObj === 'string') {
      roleObj = await Role.findById(roleObj) || roleObj;
    }

    const Company = connection.model<ICompany>('Company');
    const company = await Company.findOne({ name: companyName });
    let password = req.body.password;
    if (!password && company) {
      password = company.generalPassword;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!company) {
      return res.status(400).json({ success: false, message: 'Company not found' });
    }
    const user = new User({
      ...req.body,
      password: hashedPassword,
      role: roleObj,
      companyId: company._id,
      companyName: company.name
    });
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateUser = async (req: any, res: Response) => {
  try {
    const companyName = req.user?.companyName;
    const connection = await dbManager.getCompanyConnection(companyName);
    const User = createUserModel(connection);

    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password;
    }

    const updated = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteUser = async (req: any, res: Response) => {
  try {
    const companyName = req.user?.companyName;
    const connection = await dbManager.getCompanyConnection(companyName);
    const User = createUserModel(connection);
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};