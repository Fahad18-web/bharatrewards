import express from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';
import { generateToken, authMiddleware } from '../config/jwt.js';

const router = express.Router();

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const normalizeName = (name) =>
  String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

const levenshteinDistance = (a, b) => {
  const s = String(a || '');
  const t = String(b || '');
  if (s === t) return 0;
  if (!s.length) return t.length;
  if (!t.length) return s.length;

  const v0 = new Array(t.length + 1);
  const v1 = new Array(t.length + 1);
  for (let i = 0; i < v0.length; i++) v0[i] = i;

  for (let i = 0; i < s.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < t.length; j++) {
      const cost = s[i] === t[j] ? 0 : 1;
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (let j = 0; j < v0.length; j++) v0[j] = v1[j];
  }

  return v1[t.length];
};

const similarityRatio = (a, b) => {
  const s = String(a || '');
  const t = String(b || '');
  const maxLen = Math.max(s.length, t.length);
  if (maxLen === 0) return 1;
  const dist = levenshteinDistance(s, t);
  return 1 - dist / maxLen;
};

const getDeviceIdFromReq = (req) => {
  const raw = req.get('x-device-id');
  if (!raw) return null;
  const val = String(raw).trim();
  if (!val) return null;
  // Avoid huge headers being stored
  if (val.length > 128) return null;
  return val;
};

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

    const normalizedEmail = normalizeEmail(email);
    const normalizedName = normalizeName(name);
    const deviceId = getDeviceIdFromReq(req);
    const ip = req.ip;
    const userAgent = req.get('user-agent') || null;

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Duplicate / multi-account detection
    const DUPLICATE_PREVENTION = process.env.DUPLICATE_PREVENTION !== '0';
    const AUTO_BAN_DUPLICATES = process.env.AUTO_BAN_DUPLICATES === '1';
    const NAME_SIMILARITY_THRESHOLD = Number(process.env.DUPLICATE_NAME_SIMILARITY || 0.88);

    // How many accounts can one device create (lifetime). Default: 1
    const MAX_ACCOUNTS_PER_DEVICE = Number(process.env.MAX_ACCOUNTS_PER_DEVICE || 1);
    // How many accounts per IP in a time window. Default: 3 per 24h.
    const MAX_ACCOUNTS_PER_IP = Number(process.env.MAX_ACCOUNTS_PER_IP || 3);
    const IP_WINDOW_HOURS = Number(process.env.IP_WINDOW_HOURS || 24);

    let shouldBanOnCreate = false;
    let banReason = null;

    if (DUPLICATE_PREVENTION) {
      // Device-based check (stronger than IP)
      if (deviceId) {
        const { data: deviceUsers } = await supabase
          .from('users')
          .select('id, email, name, name_normalized, device_id, created_at')
          .eq('device_id', deviceId);

        const existingCount = Array.isArray(deviceUsers) ? deviceUsers.length : 0;
        if (existingCount >= MAX_ACCOUNTS_PER_DEVICE) {
          // If name looks similar, treat as deliberate multi-account.
          const similar = (deviceUsers || []).some((u) => {
            const existingNorm = u?.name_normalized || normalizeName(u?.name);
            if (!existingNorm || !normalizedName) return false;
            if (existingNorm === normalizedName) return true;
            return similarityRatio(existingNorm, normalizedName) >= NAME_SIMILARITY_THRESHOLD;
          });

          if (similar) {
            shouldBanOnCreate = true;
            banReason = 'Duplicate/multi-account detected (same device + similar name)';
          } else {
            // Same device but different name could be family/shared device; block (not ban) by default.
            return res.status(403).json({
              error: 'Multiple accounts from this device are not allowed. Please login to your existing account.'
            });
          }
        }
      }

      // IP-based check (weaker signal; avoid aggressive auto-ban)
      if (ip) {
        const windowStart = new Date(Date.now() - IP_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
        const { data: ipUsers } = await supabase
          .from('users')
          .select('id, name, name_normalized, created_at')
          .eq('created_ip', ip)
          .gte('created_at', windowStart);

        const ipCount = Array.isArray(ipUsers) ? ipUsers.length : 0;
        if (ipCount >= MAX_ACCOUNTS_PER_IP) {
          // If name is similar to an existing account on this IP in the window, ban-on-create; else block.
          const similar = (ipUsers || []).some((u) => {
            const existingNorm = u?.name_normalized || normalizeName(u?.name);
            if (!existingNorm || !normalizedName) return false;
            if (existingNorm === normalizedName) return true;
            return similarityRatio(existingNorm, normalizedName) >= NAME_SIMILARITY_THRESHOLD;
          });

          if (similar) {
            shouldBanOnCreate = true;
            banReason = 'Duplicate/multi-account detected (same IP + similar name)';
          } else {
            return res.status(429).json({
              error: 'Too many account creations from this network. Please try later or contact support.'
            });
          }
        }
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email: normalizedEmail,
        password_hash: passwordHash,
        name,
        email_normalized: normalizedEmail,
        name_normalized: normalizedName,
        device_id: deviceId,
        created_ip: ip,
        created_user_agent: userAgent,
        last_ip: ip,
        last_user_agent: userAgent,
        last_device_id: deviceId,
        role: targetRole,
        points: 0,
        wallet_balance: 0,
        solved_count: 0,
        ...(shouldBanOnCreate
          ? {
              is_banned: AUTO_BAN_DUPLICATES ? true : false,
              banned_at: AUTO_BAN_DUPLICATES ? new Date().toISOString() : null,
              ban_reason: AUTO_BAN_DUPLICATES ? banReason : null
            }
          : {})
      })
      .select()
      .single();

    if (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ error: 'Failed to create user' });
    }

    if (shouldBanOnCreate && AUTO_BAN_DUPLICATES) {
      return res.status(403).json({ error: 'Account creation blocked due to duplicate/multi-account detection.' });
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
