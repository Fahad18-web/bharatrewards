import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// ============================================
// GET /api/settings
// Get public app settings (no auth required)
// ============================================
router.get('/', async (req, res) => {
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

export default router;
