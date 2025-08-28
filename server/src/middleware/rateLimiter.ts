import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

interface RateLimitResponse {
  success: boolean;
  message: string;
}

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  } as RateLimitResponse,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later'
    } as RateLimitResponse);
  }
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  } as RateLimitResponse,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later'
    } as RateLimitResponse);
  }
});