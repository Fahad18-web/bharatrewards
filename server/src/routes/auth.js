import express from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';
import { generateToken, authMiddleware } from '../config/jwt.js';

const router = express.Router();

// ============================================
// POST /api/auth/register
// Register a new user
// ============================================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'USER' } = req.body;
    const targetRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

    // Admin account creation is locked. Only existing admins can login.
    if (targetRole === 'ADMIN') {
      return res.status(403).json({ error: 'Admin registration is disabled.' });
    }

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name,
        role: targetRole,
        points: 0,
        wallet_balance: 0,
        solved_count: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ error: 'Failed to create user' });
    }

    // Generate JWT token
    const token = generateToken(newUser);

    // Return user data (without password)
    const userData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      points: newUser.points,
      walletBalance: newUser.wallet_balance,
      solvedCount: newUser.solved_count,
      avatar: newUser.avatar,
      isBanned: newUser.is_banned,
      bannedAt: newUser.banned_at,
      banReason: newUser.ban_reason
    };

    res.status(201).json({ user: userData, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// POST /api/auth/login
// Login user
// ============================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.is_banned) {
      return res.status(403).json({ error: 'This account has been suspended. Please contact support.' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      points: user.points,
      walletBalance: user.wallet_balance,
      solvedCount: user.solved_count,
      avatar: user.avatar,
      isBanned: user.is_banned,
      bannedAt: user.banned_at,
      banReason: user.ban_reason
    };

    // Log activity
    await supabase.from('user_activity_log').insert({
      user_id: user.id,
      action: 'LOGIN',
      details: { method: 'password' },
      ip_address: req.ip
    });

    res.json({ user: userData, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// GET /api/auth/me
// Get current user profile
// ============================================
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      points: user.points,
      walletBalance: user.wallet_balance,
      solvedCount: user.solved_count,
      avatar: user.avatar,
      isBanned: user.is_banned,
      bannedAt: user.banned_at,
      banReason: user.ban_reason
    };

    res.json({ user: userData });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// POST /api/auth/logout
// Logout user (client-side token deletion, server-side logging)
// ============================================
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // Log activity
    await supabase.from('user_activity_log').insert({
      user_id: req.user.id,
      action: 'LOGOUT',
      ip_address: req.ip
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// PUT /api/auth/password
// Change password
// ============================================
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({ error: 'New password must be at least 4 characters' });
    }

    // Get current user
    const { data: user, error } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update password
    await supabase
      .from('users')
      .update({ password_hash: passwordHash })
      .eq('id', req.user.id);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
