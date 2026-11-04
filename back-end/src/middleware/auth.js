import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Check Bearer Token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Fallback: check secure httpOnly cookie
  else if (req.cookies && req.cookies.token && req.cookies.token !== 'none') {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, please sign in' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'mindpulse_super_secure_jwt_secret_key_2026'
    );

    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    } else {
      req.user = {
        _id: decoded.id,
        email: decoded.email,
        role: decoded.role || 'user',
      };
    }
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Session expired, please sign in again' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admins only' });
  }
};
