import express from 'express';
import { supabase } from '../config/supabase.js';
import { authMiddleware } from '../config/jwt.js';

const router = express.Router();

// ============================================
// GET /api/redeem
// Get user's redeem requests
// ============================================
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data: requests, error } = await supabase
      .from('redeem_requests')
      .select(`
        id,
        amount_points,
        amount_rupees,
        status,
        created_at,
        processed_at
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get redeem requests error:', error);
      return res.status(500).json({ error: 'Failed to fetch redeem requests' });
    }

    // Map to frontend format
    const mappedRequests = requests.map(r => ({
      id: r.id,
      amountPoints: r.amount_points,
      amountRupees: parseFloat(r.amount_rupees),
      status: r.status,
      date: new Date(r.created_at).toLocaleDateString(),
      processedAt: r.processed_at
    }));

    res.json({ requests: mappedRequests });
  } catch (error) {
    console.error('Get redeem requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// POST /api/redeem
// Create a new redeem request
// ============================================
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's current points
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('points, email, name')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get settings
    const { data: settings } = await supabase
      .from('app_settings')
      .select('key, value');

    const settingsMap = {};
    settings?.forEach(s => {
      settingsMap[s.key] = parseInt(s.value);
    });

    const minRedeemPoints = settingsMap.min_redeem_points || 14000;
    const currencyRate = settingsMap.currency_rate || 35;

    // Check if user has enough points
    if (user.points < minRedeemPoints) {
      return res.status(400).json({
        error: `Minimum ${minRedeemPoints} points required to redeem`,
        currentPoints: user.points,
        minRequired: minRedeemPoints
      });
    }

    // Check for pending requests
    const { data: pendingRequests } = await supabase
      .from('redeem_requests')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'PENDING');

    if (pendingRequests && pendingRequests.length > 0) {
      return res.status(400).json({
        error: 'You already have a pending redeem request. Please wait for it to be processed.'
      });
    }

    // Calculate amount in rupees
    const amountRupees = Math.floor(user.points / 10000 * currencyRate);

    // Create redeem request
    const { data: request, error: requestError } = await supabase
      .from('redeem_requests')
      .insert({
        user_id: userId,
        amount_points: user.points,
        amount_rupees: amountRupees,
        status: 'PENDING'
      })
      .select()
      .single();

    if (requestError) {
      console.error('Create redeem request error:', requestError);
      return res.status(500).json({ error: 'Failed to create redeem request' });
    }

    // Log activity
    await supabase.from('user_activity_log').insert({
      user_id: userId,
      action: 'REDEEM_REQUEST',
      details: {
        points: user.points,
        rupees: amountRupees
      }
    });

    res.status(201).json({
      message: 'Redeem request submitted successfully',
      request: {
        id: request.id,
        amountPoints: request.amount_points,
        amountRupees: parseFloat(request.amount_rupees),
        status: request.status,
        date: new Date(request.created_at).toLocaleDateString()
      }
    });
  } catch (error) {
    console.error('Create redeem request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// GET /api/redeem/all
// Get all redeem requests (Admin only)
// ============================================
router.get('/all', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { data: requests, error } = await supabase
      .from('redeem_requests')
      .select(`
        id,
        user_id,
        amount_points,
        amount_rupees,
        status,
        created_at,
        processed_at,
        admin_notes,
        users!inner (
          email,
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get all redeem requests error:', error);
      return res.status(500).json({ error: 'Failed to fetch redeem requests' });
    }

    // Map to frontend format
    const mappedRequests = requests.map(r => ({
      id: r.id,
      userId: r.user_id,
      userEmail: r.users.email,
      userName: r.users.name,
      amountPoints: r.amount_points,
      amountRupees: parseFloat(r.amount_rupees),
      status: r.status,
      date: new Date(r.created_at).toLocaleDateString(),
      processedAt: r.processed_at,
      adminNotes: r.admin_notes
    }));

    res.json({ requests: mappedRequests });
  } catch (error) {
    console.error('Get all redeem requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// PUT /api/redeem/:id
// Update redeem request status (Admin only)
// ============================================
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be APPROVED or REJECTED' });
    }

    // Get the request first
    const { data: request, error: fetchError } = await supabase
      .from('redeem_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !request) {
      return res.status(404).json({ error: 'Redeem request not found' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ error: 'This request has already been processed' });
    }

    // Update the request
    const { data: updatedRequest, error: updateError } = await supabase
      .from('redeem_requests')
      .update({
        status,
        admin_notes: adminNotes || null,
        processed_by: req.user.id,
        processed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update redeem request error:', updateError);
      return res.status(500).json({ error: 'Failed to update redeem request' });
    }

    // If approved, deduct points from user
    if (status === 'APPROVED') {
      await supabase
        .from('users')
        .update({ points: 0 })
        .eq('id', request.user_id);
    }

    // Log activity
    await supabase.from('user_activity_log').insert({
      user_id: req.user.id,
      action: 'REDEEM_PROCESSED',
      details: {
        request_id: id,
        status,
        user_id: request.user_id,
        amount: request.amount_rupees
      }
    });

    res.json({
      message: `Request ${status.toLowerCase()} successfully`,
      request: {
        id: updatedRequest.id,
        status: updatedRequest.status,
        processedAt: updatedRequest.processed_at
      }
    });
  } catch (error) {
    console.error('Update redeem request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
