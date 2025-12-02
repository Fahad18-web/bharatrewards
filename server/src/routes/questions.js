import express from 'express';
import { supabase } from '../config/supabase.js';
import { authMiddleware } from '../config/jwt.js';
import { getStaticQuestions } from '../data/questions.js';

const router = express.Router();

// ============================================
// GET /api/questions
// Get questions by category (with custom questions prioritized)
// ============================================
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { category, count = 5 } = req.query;
    const parsedCount = Math.min(100, Math.max(1, parseInt(count, 10) || 5));

    if (!category || !['MATH', 'QUIZ', 'PUZZLE', 'TYPING', 'CAPTCHA'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category. Must be MATH, QUIZ, PUZZLE, TYPING, or CAPTCHA' });
    }

    let customQuestions = [];

    try {
      const { data, error } = await supabase
        .from('custom_questions')
        .select('*')
        .eq('type', category)
        .eq('is_active', true);

      if (error) {
        console.warn('Fetch questions warning:', error.message);
      } else if (data?.length) {
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        customQuestions = shuffled.slice(0, parsedCount).map((q) => ({
          id: q.id,
          type: q.type,
          questionText: q.question_text,
          correctAnswer: q.correct_answer,
          options: q.options
        }));
      }
    } catch (dbError) {
      console.warn('Custom question fetch failed, using static bank only:', dbError.message);
    }

    const neededStatic = Math.max(0, parsedCount - customQuestions.length);
    const staticQuestions = neededStatic > 0
      ? getStaticQuestions(category, neededStatic)
      : [];

    const questions = [...customQuestions, ...staticQuestions].slice(0, parsedCount);

    res.json({
      questions,
      total: questions.length,
      source: customQuestions.length ? 'custom+static' : 'static'
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// POST /api/questions/answer
// Submit answer and update points
// ============================================
router.post('/answer', authMiddleware, async (req, res) => {
  try {
    const { questionId, answer, isCorrect, category } = req.body;
    const userId = req.user.id;

    // Get settings to know points per question
    const { data: settingsData } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'points_per_question')
      .single();

    const pointsPerQuestion = settingsData ? parseInt(settingsData.value) : 10;

    if (isCorrect) {
      // Update user points
      const { data: currentUser } = await supabase
        .from('users')
        .select('points, solved_count')
        .eq('id', userId)
        .single();

      if (currentUser) {
        await supabase
          .from('users')
          .update({
            points: currentUser.points + pointsPerQuestion,
            solved_count: currentUser.solved_count + 1
          })
          .eq('id', userId);
      }
    }

    // Log the answer for analytics (optional)
    await supabase.from('user_activity_log').insert({
      user_id: userId,
      action: 'ANSWER_QUESTION',
      details: {
        question_id: questionId,
        category,
        is_correct: isCorrect,
        points_earned: isCorrect ? pointsPerQuestion : 0
      }
    });

    // Get updated user data
    const { data: user } = await supabase
      .from('users')
      .select('id, email, name, role, points, wallet_balance, solved_count')
      .eq('id', userId)
      .single();

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      points: user.points,
      walletBalance: user.wallet_balance,
      solvedCount: user.solved_count
    };

    res.json({
      correct: isCorrect,
      pointsEarned: isCorrect ? pointsPerQuestion : 0,
      user: userData
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// POST /api/questions/session/start
// Start a new game session
// ============================================
router.post('/session/start', authMiddleware, async (req, res) => {
  try {
    const { category } = req.body;

    if (!category || !['MATH', 'QUIZ', 'PUZZLE', 'TYPING'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const { data: session, error } = await supabase
      .from('game_sessions')
      .insert({
        user_id: req.user.id,
        category,
        questions_attempted: 0,
        correct_answers: 0,
        points_earned: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Start session error:', error);
      return res.status(500).json({ error: 'Failed to start game session' });
    }

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// PUT /api/questions/session/:id/end
// End a game session
// ============================================
router.put('/session/:id/end', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { questionsAttempted, correctAnswers, pointsEarned } = req.body;

    const { data: session, error } = await supabase
      .from('game_sessions')
      .update({
        questions_attempted: questionsAttempted,
        correct_answers: correctAnswers,
        points_earned: pointsEarned,
        ended_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      console.error('End session error:', error);
      return res.status(500).json({ error: 'Failed to end game session' });
    }

    res.json({ session });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// GET /api/questions/fallback
// Get fallback questions when no custom questions available
// ============================================
router.get('/fallback', authMiddleware, async (req, res) => {
  const { category = 'QUIZ', count = 5 } = req.query;
  if (!['MATH', 'QUIZ', 'PUZZLE', 'TYPING'].includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  const parsedCount = Math.min(100, Math.max(1, parseInt(count, 10) || 5));
  const questions = getStaticQuestions(category, parsedCount);
  res.json({ questions, total: questions.length });
});

export default router;
