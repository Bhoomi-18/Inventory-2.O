import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/User';
import { userRegistrationSchema, userLoginSchema } from '../utils/validation';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Register user (Admin only)
router.post('/register', authenticate, authorize([UserRole.ADMIN]), async (req: AuthRequest, res) => {
  try {
    const validatedData = userRegistrationSchema.parse(req.body);
    
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    const user = new User({
      ...validatedData,
      password: hashedPassword
    });

    await user.save();
    
    const { password, ...userResponse } = user.toObject();
    return res.status(201).json({ user: userResponse });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const validatedData = userLoginSchema.parse(req.body);
    
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    const { password, ...userResponse } = user.toObject();
    return res.json({ token, user: userResponse });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  return res.json({ user: req.user });
});

export default router;