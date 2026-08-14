import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
      error: 'AUTH_NOT_ADMIN',
    });
  }
};

export default adminOnly;
