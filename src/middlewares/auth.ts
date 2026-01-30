import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { type IUser, UserRole } from '../models/User.ts';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.status(401).json({ message: 'Not authorized, user not found' });
      if (user.status === 'INACTIVE') return res.status(403).json({ message: 'Account is deactivated' });
      req.user = user as IUser;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) res.status(401).json({ message: 'Not authorized, no token' });
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role ${req.user?.role} is not authorized` });
    }
    next();
  };
};
