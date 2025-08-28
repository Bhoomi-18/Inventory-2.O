import express from 'express';
import authController from '../controllers/auth/authController';
import { authenticate, authorize } from '../middleware/auth';
import { validateSignup, validateLogin, validateCompanyName } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.post('/signup', authLimiter, validateSignup, authController.signup.bind(authController));
router.post('/login', authLimiter, validateLogin, authController.login.bind(authController));
router.get('/check-company', validateCompanyName, authController.checkCompany);

router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, authController.logout);

export default router