import express from 'express';
import { supabase } from '../config/supabase.js';
import { authMiddleware, adminMiddleware } from '../config/jwt.js';

const router = express.Router();

// ============================================
// GET /api/community/announcements
// Get all active announcements (public)
// ============================================
router.get('/announcements', async (req, res) => {
  try {
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch announcements error:', error);
      return res.status(500).json({ error: 'Failed to fetch announcements' });
    }

    const mapped = (announcements || []).map(a => ({
      id: a.id,
      title: a.title,
      content: a.content,
      type: a.type,
      isActive: a.is_active,
      isPinned: a.is_pinned,
      createdAt: a.created_at,
      expiresAt: a.expires_at,
      createdBy: a.created_by
    }));

    res.json({ announcements: mapped });
  } catch (err) {
    console.error('Announcements route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// ADMIN ROUTES - Require admin access
// ============================================

// GET /api/community/admin/announcements - Get all announcements for admin
router.get('/admin/announcements', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Admin fetch announcements error:', error);
      return res.status(500).json({ error: 'Failed to fetch announcements' });
    }

    const mapped = (announcements || []).map(a => ({
      id: a.id,
      title: a.title,
      content: a.content,
      type: a.type,
      isActive: a.is_active,
      isPinned: a.is_pinned,
      createdAt: a.created_at,
      expiresAt: a.expires_at,
      createdBy: a.created_by
    }));

    res.json({ announcements: mapped });
  } catch (err) {
    console.error('Admin announcements route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/community/admin/announcements - Create announcement
router.post('/admin/announcements', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, content, type = 'INFO', isPinned = false, expiresAt = null } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const { data: announcement, error } = await supabase
      .from('announcements')
      .insert({
        title,
        content,
        type,
        is_active: true,
        is_pinned: isPinned,
        expires_at: expiresAt,
        created_by: req.user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Create announcement error:', error);
      return res.status(500).json({ error: 'Failed to create announcement' });
    }

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement: {
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        isActive: announcement.is_active,
        isPinned: announcement.is_pinned,
        createdAt: announcement.created_at,
        expiresAt: announcement.expires_at,
        createdBy: announcement.created_by
      }
    });
  } catch (err) {
    console.error('Create announcement route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/community/admin/announcements/:id - Update announcement
router.put('/admin/announcements/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, isActive, isPinned, expiresAt } = req.body;

    const updatePayload = {};
    if (title !== undefined) updatePayload.title = title;
    if (content !== undefined) updatePayload.content = content;
    if (type !== undefined) updatePayload.type = type;
    if (isActive !== undefined) updatePayload.is_active = isActive;
    if (isPinned !== undefined) updatePayload.is_pinned = isPinned;
    if (expiresAt !== undefined) updatePayload.expires_at = expiresAt;

    const { data: announcement, error } = await supabase
      .from('announcements')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update announcement error:', error);
      return res.status(500).json({ error: 'Failed to update announcement' });
    }

    res.json({
      message: 'Announcement updated successfully',
      announcement: {
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        isActive: announcement.is_active,
        isPinned: announcement.is_pinned,
        createdAt: announcement.created_at,
        expiresAt: announcement.expires_at,
        createdBy: announcement.created_by
      }
    });
  } catch (err) {
    console.error('Update announcement route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/community/admin/announcements/:id - Delete announcement
router.delete('/admin/announcements/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete announcement error:', error);
      return res.status(500).json({ error: 'Failed to delete announcement' });
    }

    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    console.error('Delete announcement route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/community/admin/announcements/:id/toggle - Toggle announcement status
router.post('/admin/announcements/:id/toggle', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // First get current status
    const { data: current, error: fetchError } = await supabase
      .from('announcements')
      .select('is_active')
      .eq('id', id)
      .single();

    if (fetchError || !current) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    const { data: announcement, error } = await supabase
      .from('announcements')
      .update({ is_active: !current.is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Toggle announcement error:', error);
      return res.status(500).json({ error: 'Failed to toggle announcement' });
    }

    res.json({
      message: `Announcement ${announcement.is_active ? 'activated' : 'deactivated'} successfully`,
      announcement: {
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        isActive: announcement.is_active,
        isPinned: announcement.is_pinned,
        createdAt: announcement.created_at,
        expiresAt: announcement.expires_at,
        createdBy: announcement.created_by
      }
    });
  } catch (err) {
    console.error('Toggle announcement route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// FEEDBACK ROUTES - User submissions
// ============================================

const mapFeedback = (f) => ({
  id: f.id,
  userId: f.user_id,
  userEmail: f.user_email,
  userName: f.user_name,
  type: f.type,
  title: f.title,
  content: f.content,
  status: f.status,
  adminResponse: f.admin_response,
  createdAt: f.created_at,
  updatedAt: f.updated_at
});

// GET /api/community/feedback - Get user's own feedback
router.get('/feedback', authMiddleware, async (req, res) => {
  try {
    const { data: feedback, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch user feedback error:', error);
      return res.status(500).json({ error: 'Failed to fetch feedback' });
    }

    res.json({ feedback: (feedback || []).map(mapFeedback) });
  } catch (err) {
    console.error('User feedback route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/community/feedback - Submit new feedback
router.post('/feedback', authMiddleware, async (req, res) => {
  try {
    const { type = 'SUGGESTION', title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    if (!['SUGGESTION', 'FEATURE_REQUEST', 'BUG_REPORT', 'OTHER'].includes(type)) {
      return res.status(400).json({ error: 'Invalid feedback type' });
    }

    const { data: feedback, error } = await supabase
      .from('feedback')
      .insert({
        user_id: req.user.id,
        user_email: req.user.email,
        user_name: req.user.name,
        type,
        title,
        content,
        status: 'PENDING'
      })
      .select()
      .single();

    if (error) {
      console.error('Create feedback error:', error);
      return res.status(500).json({ error: 'Failed to submit feedback' });
    }

    res.status(201).json({
      message: 'Feedback submitted successfully! Thank you for your input.',
      feedback: mapFeedback(feedback)
    });
  } catch (err) {
    console.error('Create feedback route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// ADMIN FEEDBACK ROUTES
// ============================================

// GET /api/community/admin/feedback - Get all feedback for admin
router.get('/admin/feedback', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, type } = req.query;
    
    let query = supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    if (type) {
      query = query.eq('type', type);
    }

    const { data: feedback, error } = await query;

    if (error) {
      console.error('Admin fetch feedback error:', error);
      return res.status(500).json({ error: 'Failed to fetch feedback' });
    }

    res.json({ feedback: (feedback || []).map(mapFeedback) });
  } catch (err) {
    console.error('Admin feedback route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/community/admin/feedback/:id - Update feedback status/response
router.put('/admin/feedback/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const updatePayload = { updated_at: new Date().toISOString() };
    if (status) updatePayload.status = status;
    if (adminResponse !== undefined) updatePayload.admin_response = adminResponse;

    const { data: feedback, error } = await supabase
      .from('feedback')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update feedback error:', error);
      return res.status(500).json({ error: 'Failed to update feedback' });
    }

    res.json({
      message: 'Feedback updated successfully',
      feedback: mapFeedback(feedback)
    });
  } catch (err) {
    console.error('Update feedback route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/community/admin/feedback/:id - Delete feedback
router.delete('/admin/feedback/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete feedback error:', error);
      return res.status(500).json({ error: 'Failed to delete feedback' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    console.error('Delete feedback route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
