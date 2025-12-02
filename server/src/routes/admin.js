import express from 'express';
import { supabase } from '../config/supabase.js';
import { authMiddleware, adminMiddleware } from '../config/jwt.js';

const router = express.Router();
// Only query columns that exist - ban columns are optional
const USER_COLUMNS = 'id, email, name, role, points, wallet_balance, solved_count, created_at';

const mapUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  points: Number(user.points) || 0,
  walletBalance: Number(user.wallet_balance) || 0,
  solvedCount: Number(user.solved_count) || 0,
  createdAt: user.created_at,
  isBanned: user.is_banned ?? false,
  banReason: user.ban_reason ?? null,
  bannedAt: user.banned_at ?? null
});

// All routes require admin access
router.use(authMiddleware, adminMiddleware);

// ============================================
// GET /api/admin/users
// Full user directory for admins
// ============================================
router.get('/users', async (req, res) => {
  try {
    console.log('=== Admin Users Request ===');
    console.log('Requesting user:', req.user?.email);
    
    const { data: users, error } = await supabase
      .from('users')
      .select(USER_COLUMNS)
      .order('created_at', { ascending: false });

    console.log('Supabase response - error:', error);
    console.log('Supabase response - users count:', users?.length ?? 0);
    console.log('Supabase response - users:', JSON.stringify(users, null, 2));

    if (error) {
      console.error('Admin fetch users error:', error);
      return res.status(500).json({ error: 'Failed to load users' });
    }

    const mappedUsers = users?.map((user) => mapUser(user)) ?? [];
    console.log('Mapped users count:', mappedUsers.length);
    res.json({ users: mappedUsers });
  } catch (err) {
    console.error('Admin users route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// POST /api/admin/users/:id/ban
// Suspend or unsuspend a user
// ============================================
router.post('/users/:id/ban', async (req, res) => {
  try {
    const { id } = req.params;
    const { ban = true, reason = '' } = req.body || {};

    if (req.user.id === id) {
      return res.status(400).json({ error: 'You cannot change the status of your own account' });
    }

    const { data: targetUser, error: fetchError } = await supabase
      .from('users')
      .select(USER_COLUMNS)
      .eq('id', id)
      .single();

    if (fetchError || !targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (targetUser.role === 'ADMIN') {
      return res.status(400).json({ error: 'Cannot ban another admin account' });
    }

    const updatePayload = ban
      ? { is_banned: true, banned_at: new Date().toISOString(), ban_reason: reason || null }
      : { is_banned: false, banned_at: null, ban_reason: null };

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updatePayload)
      .eq('id', id)
      .select(USER_COLUMNS)
      .single();

    if (updateError) {
      console.error('Ban user error:', updateError);
      return res.status(500).json({ error: 'Failed to update user status' });
    }

    await supabase.from('user_activity_log').insert({
      user_id: req.user.id,
      action: ban ? 'USER_BANNED' : 'USER_UNBANNED',
      details: { targetUser: id, reason }
    });

    res.json({
      message: ban ? 'User banned successfully' : 'User reinstated successfully',
      user: mapUser(updatedUser)
    });
  } catch (error) {
    console.error('Toggle user ban error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// DELETE /api/admin/users/:id
// Permanently delete a user
// ============================================
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id === id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    const { data: targetUser, error: fetchError } = await supabase
      .from('users')
      .select('id, role, email')
      .eq('id', id)
      .single();

    if (fetchError || !targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (targetUser.role === 'ADMIN') {
      return res.status(400).json({ error: 'Cannot delete another admin account' });
    }

    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete user error:', deleteError);
      return res.status(500).json({ error: 'Failed to delete user' });
    }

    await supabase.from('user_activity_log').insert({
      user_id: req.user.id,
      action: 'USER_DELETED',
      details: { targetUser: id, email: targetUser.email }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// GET /api/admin/dashboard
// Get dashboard statistics
// ============================================
router.get('/dashboard', async (req, res) => {
  try {
    // Get total users count
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'USER');

    // Get pending redeem requests count
    const { count: pendingRedeems } = await supabase
      .from('redeem_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PENDING');

    // Get total paid amount
    const { data: paidData } = await supabase
      .from('redeem_requests')
      .select('amount_rupees')
      .eq('status', 'APPROVED');

    const totalPaid = paidData?.reduce((sum, r) => sum + parseFloat(r.amount_rupees), 0) || 0;

    // Get total questions count
    const { count: totalQuestions } = await supabase
      .from('custom_questions')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get total points distributed
    const { data: pointsData } = await supabase
      .from('users')
      .select('points')
      .eq('role', 'USER');

    const totalPointsDistributed = pointsData?.reduce((sum, u) => sum + u.points, 0) || 0;

    res.json({
      stats: {
        totalUsers: totalUsers || 0,
        pendingRedeems: pendingRedeems || 0,
        totalPaid: Math.round(totalPaid * 100) / 100,
        totalQuestions: totalQuestions || 0,
        totalPointsDistributed
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// GET /api/admin/settings
// Get all app settings
// ============================================
router.get('/settings', async (req, res) => {
  try {
    const { data: settings, error } = await supabase
      .from('app_settings')
      .select('key, value');

    if (error) {
      console.error('Get settings error:', error);
      return res.status(500).json({ error: 'Failed to fetch settings' });
    }

    // Convert to object format for frontend
    const settingsObj = {
      minRedeemPoints: 14000,
      pointsPerQuestion: 10,
      currencyRate: 35
    };

    settings?.forEach(s => {
      switch (s.key) {
        case 'min_redeem_points':
          settingsObj.minRedeemPoints = parseInt(s.value);
          break;
        case 'points_per_question':
          settingsObj.pointsPerQuestion = parseInt(s.value);
          break;
        case 'currency_rate':
          settingsObj.currencyRate = parseInt(s.value);
          break;
      }
    });

    res.json({ settings: settingsObj });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// PUT /api/admin/settings
// Update app settings
// ============================================
router.put('/settings', async (req, res) => {
  try {
    const { minRedeemPoints, pointsPerQuestion, currencyRate } = req.body;

    const updates = [];

    if (minRedeemPoints !== undefined) {
      updates.push(
        supabase
          .from('app_settings')
          .upsert({ key: 'min_redeem_points', value: minRedeemPoints.toString() }, { onConflict: 'key' })
      );
    }

    if (pointsPerQuestion !== undefined) {
      updates.push(
        supabase
          .from('app_settings')
          .upsert({ key: 'points_per_question', value: pointsPerQuestion.toString() }, { onConflict: 'key' })
      );
    }

    if (currencyRate !== undefined) {
      updates.push(
        supabase
          .from('app_settings')
          .upsert({ key: 'currency_rate', value: currencyRate.toString() }, { onConflict: 'key' })
      );
    }

    await Promise.all(updates);

    // Log activity
    await supabase.from('user_activity_log').insert({
      user_id: req.user.id,
      action: 'SETTINGS_UPDATED',
      details: { minRedeemPoints, pointsPerQuestion, currencyRate }
    });

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// GET /api/admin/questions
// Get all custom questions
// ============================================
router.get('/questions', async (req, res) => {
  try {
    const { category } = req.query;

    let query = supabase
      .from('custom_questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('type', category);
    }

    const { data: questions, error } = await query;

    if (error) {
      console.error('Get questions error:', error);
      return res.status(500).json({ error: 'Failed to fetch questions' });
    }

    // Map to frontend format
    const mappedQuestions = questions.map(q => ({
      id: q.id,
      type: q.type,
      questionText: q.question_text,
      correctAnswer: q.correct_answer,
      options: q.options,
      isActive: q.is_active,
      createdAt: q.created_at
    }));

    res.json({ questions: mappedQuestions });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// POST /api/admin/questions
// Create a new custom question
// ============================================
router.post('/questions', async (req, res) => {
  try {
    const { type, questionText, correctAnswer, options } = req.body;

    if (!type || !questionText || !correctAnswer) {
      return res.status(400).json({ error: 'Type, questionText, and correctAnswer are required' });
    }

    if (!['MATH', 'QUIZ', 'PUZZLE', 'TYPING'].includes(type)) {
      return res.status(400).json({ error: 'Invalid question type' });
    }

    const { data: question, error } = await supabase
      .from('custom_questions')
      .insert({
        type,
        question_text: questionText,
        correct_answer: correctAnswer,
        options: options || null,
        created_by: req.user.id,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Create question error:', error);
      return res.status(500).json({ error: 'Failed to create question' });
    }

    res.status(201).json({
      message: 'Question created successfully',
      question: {
        id: question.id,
        type: question.type,
        questionText: question.question_text,
        correctAnswer: question.correct_answer,
        options: question.options,
        isActive: question.is_active
      }
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// PUT /api/admin/questions/:id
// Update a custom question
// ============================================
router.put('/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, questionText, correctAnswer, options, isActive } = req.body;

    const updateData = {};
    if (type) updateData.type = type;
    if (questionText) updateData.question_text = questionText;
    if (correctAnswer) updateData.correct_answer = correctAnswer;
    if (options !== undefined) updateData.options = options;
    if (isActive !== undefined) updateData.is_active = isActive;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const { data: question, error } = await supabase
      .from('custom_questions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update question error:', error);
      return res.status(500).json({ error: 'Failed to update question' });
    }

    res.json({
      message: 'Question updated successfully',
      question: {
        id: question.id,
        type: question.type,
        questionText: question.question_text,
        correctAnswer: question.correct_answer,
        options: question.options,
        isActive: question.is_active
      }
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// DELETE /api/admin/questions/:id
// Delete a custom question
// ============================================
router.delete('/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('custom_questions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete question error:', error);
      return res.status(500).json({ error: 'Failed to delete question' });
    }

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// GET /api/admin/activity
// Get recent user activity
// ============================================
router.get('/activity', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const { data: activities, error } = await supabase
      .from('user_activity_log')
      .select(`
        id,
        action,
        details,
        created_at,
        users (
          email,
          name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Get activity error:', error);
      return res.status(500).json({ error: 'Failed to fetch activity' });
    }

    res.json({ activities });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
