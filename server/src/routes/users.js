import express from 'express';
import { supabase } from '../config/supabase.js';
import { authMiddleware, adminMiddleware } from '../config/jwt.js';

const router = express.Router();

// ============================================
// GET /api/users
// Get all users (Admin only)
// ============================================
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, name, role, points, wallet_balance, solved_count, avatar, created_at, is_banned, ban_reason, banned_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get users error:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    // Map to frontend format
    const mappedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      points: user.points,
      walletBalance: user.wallet_balance,
      solvedCount: user.solved_count,
      avatar: user.avatar,
      createdAt: user.created_at,
      isBanned: user.is_banned,
      banReason: user.ban_reason,
      bannedAt: user.banned_at
    }));

    res.json({ users: mappedUsers });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// GET /api/users/:id
// Get single user by ID
// ============================================
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only view their own profile, admins can view any
    if (req.user.role !== 'ADMIN' && req.user.id !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, points, wallet_balance, solved_count, avatar, created_at, is_banned, ban_reason, banned_at')
      .eq('id', id)
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
      createdAt: user.created_at,
      isBanned: user.is_banned,
      banReason: user.ban_reason,
      bannedAt: user.banned_at
    };

    res.json({ user: userData });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// PUT /api/users/:id
// Update user profile
// ============================================
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, avatar } = req.body;

    // Users can only update their own profile
    if (req.user.role !== 'ADMIN' && req.user.id !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (avatar !== undefined) updateData.avatar = avatar;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, email, name, role, points, wallet_balance, solved_count, avatar, is_banned, ban_reason, banned_at')
      .single();

    if (error) {
      console.error('Update user error:', error);
      return res.status(500).json({ error: 'Failed to update user' });
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
      banReason: user.ban_reason,
      bannedAt: user.banned_at
    };

    res.json({ user: userData });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// PUT /api/users/:id/points
// Update user points (after answering questions)
// ============================================
router.put('/:id/points', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { pointsToAdd, incrementSolved = false } = req.body;

    // Users can only update their own points
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (typeof pointsToAdd !== 'number' || pointsToAdd < 0) {
      return res.status(400).json({ error: 'Invalid points value' });
    }

    // Get current user data
    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('points, solved_count')
      .eq('id', id)
      .single();

    if (fetchError || !currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newPoints = currentUser.points + pointsToAdd;
    const newSolvedCount = incrementSolved ? currentUser.solved_count + 1 : currentUser.solved_count;

    const { data: user, error } = await supabase
      .from('users')
      .update({
        points: newPoints,
        solved_count: newSolvedCount
      })
      .eq('id', id)
      .select('id, email, name, role, points, wallet_balance, solved_count, is_banned, ban_reason, banned_at')
      .single();

    if (error) {
      console.error('Update points error:', error);
      return res.status(500).json({ error: 'Failed to update points' });
    }

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      points: user.points,
      walletBalance: user.wallet_balance,
      solvedCount: user.solved_count,
      isBanned: user.is_banned,
      banReason: user.ban_reason,
      bannedAt: user.banned_at
    };

    res.json({ user: userData });
  } catch (error) {
    console.error('Update points error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// GET /api/users/leaderboard
// Get top users by points
// ============================================
router.get('/stats/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, points, solved_count')
      .eq('role', 'USER')
      .order('points', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Get leaderboard error:', error);
      return res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }

    res.json({ leaderboard: users });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
