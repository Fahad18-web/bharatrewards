import jwt from 'jsonwebtoken';
import { supabase } from './supabase.js';

const isProd = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET;

if (isProd && (!JWT_SECRET || JWT_SECRET === 'fallback-secret-change-in-production')) {
  throw new Error('JWT_SECRET must be set to a strong value in production');
}

const effectiveJwtSecret = JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Generate JWT token for a user
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    effectiveJwtSecret,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verify and decode JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, effectiveJwtSecret);
  } catch (error) {
    return null;
  }
};

// Middleware to protect routes
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { data: userRecord, error } = await supabase
      .from('users')
      .select('id, email, role, name, is_banned')
      .eq('id', decoded.id)
      .single();

    if (error || !userRecord) {
      return res.status(401).json({ error: 'User session is no longer valid' });
    }

    if (userRecord.is_banned) {
      return res.status(403).json({ error: 'Account suspended. Contact support for assistance.' });
    }

    req.user = {
      id: userRecord.id,
      email: userRecord.email,
      role: userRecord.role,
      name: userRecord.name
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Failed to authenticate request' });
  }
};

// Middleware to check if user is admin
export const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export default {
  generateToken,
  verifyToken,
  authMiddleware,
  adminMiddleware
};
