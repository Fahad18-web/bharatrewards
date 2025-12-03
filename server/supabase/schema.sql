-- BharatRewards Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    points INTEGER DEFAULT 0,
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    solved_count INTEGER DEFAULT 0,
    is_banned BOOLEAN DEFAULT FALSE,
    banned_at TIMESTAMP WITH TIME ZONE,
    ban_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================
-- APP SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO app_settings (key, value) VALUES 
    ('min_redeem_points', '14000'),
    ('points_per_question', '10'),
    ('currency_rate', '35')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- CUSTOM QUESTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS custom_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('MATH', 'QUIZ', 'PUZZLE', 'TYPING', 'CAPTCHA')),
    question_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    options JSONB DEFAULT NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for question type lookups
CREATE INDEX IF NOT EXISTS idx_questions_type ON custom_questions(type);
CREATE INDEX IF NOT EXISTS idx_questions_active ON custom_questions(is_active);

-- ============================================
-- REDEEM REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS redeem_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount_points INTEGER NOT NULL,
    amount_rupees DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    admin_notes TEXT,
    processed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for redeem requests
CREATE INDEX IF NOT EXISTS idx_redeem_user ON redeem_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_redeem_status ON redeem_requests(status);

-- ============================================
-- GAME SESSIONS TABLE (for analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(20) NOT NULL CHECK (category IN ('MATH', 'QUIZ', 'PUZZLE', 'TYPING', 'CAPTCHA')),
    questions_attempted INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for game sessions
CREATE INDEX IF NOT EXISTS idx_session_user ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_session_category ON game_sessions(category);

-- ============================================
-- USER ACTIVITY LOG (for auditing)
-- ============================================
CREATE TABLE IF NOT EXISTS user_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for activity lookups
CREATE INDEX IF NOT EXISTS idx_activity_user ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_action ON user_activity_log(action);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Apply update trigger to tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function & trigger to cap total admins to 3
CREATE OR REPLACE FUNCTION enforce_admin_limit()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    current_admins INTEGER;
BEGIN
    IF NEW.role = 'ADMIN' THEN
        IF TG_OP = 'UPDATE' AND OLD.role = 'ADMIN' THEN
            RETURN NEW;
        END IF;

        SELECT COUNT(*) INTO current_admins FROM users WHERE role = 'ADMIN';

        IF current_admins >= 3 THEN
            RAISE EXCEPTION 'Cannot have more than 3 admin users';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_admin_limit_trigger ON users;
CREATE TRIGGER enforce_admin_limit_trigger
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION enforce_admin_limit();

DROP TRIGGER IF EXISTS update_settings_updated_at ON app_settings;
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON app_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_questions_updated_at ON custom_questions;
CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON custom_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_redeem_updated_at ON redeem_requests;
CREATE TRIGGER update_redeem_updated_at
    BEFORE UPDATE ON redeem_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE redeem_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Policies for users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'ADMIN')
    );

-- Policies for custom_questions (anyone can read active questions)
DROP POLICY IF EXISTS "Anyone can read active questions" ON custom_questions;
DROP POLICY IF EXISTS "Admins can manage questions" ON custom_questions;
CREATE POLICY "Anyone can read active questions" ON custom_questions
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage questions" ON custom_questions
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'ADMIN')
    );

-- Policies for redeem_requests
DROP POLICY IF EXISTS "Users can view own requests" ON redeem_requests;
DROP POLICY IF EXISTS "Users can create own requests" ON redeem_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON redeem_requests;
CREATE POLICY "Users can view own requests" ON redeem_requests
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can create own requests" ON redeem_requests
    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Admins can view all requests" ON redeem_requests
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'ADMIN')
    );

-- Policies for app_settings (anyone can read)
DROP POLICY IF EXISTS "Anyone can read settings" ON app_settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON app_settings;
CREATE POLICY "Anyone can read settings" ON app_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON app_settings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'ADMIN')
    );

-- Policies for game_sessions
DROP POLICY IF EXISTS "Users can view own sessions" ON game_sessions;
DROP POLICY IF EXISTS "Users can create own sessions" ON game_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON game_sessions;
DROP POLICY IF EXISTS "Admins can view all sessions" ON game_sessions;
CREATE POLICY "Users can view own sessions" ON game_sessions
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can create own sessions" ON game_sessions
    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update own sessions" ON game_sessions
    FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "Admins can view all sessions" ON game_sessions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'ADMIN')
    );

-- Policies for user_activity_log
DROP POLICY IF EXISTS "Users can view own activity" ON user_activity_log;
DROP POLICY IF EXISTS "Admins can view all activity" ON user_activity_log;
DROP POLICY IF EXISTS "System can insert activity" ON user_activity_log;
CREATE POLICY "Users can view own activity" ON user_activity_log
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Admins can view all activity" ON user_activity_log
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'ADMIN')
    );

CREATE POLICY "System can insert activity" ON user_activity_log
    FOR INSERT WITH CHECK (true);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for dashboard statistics
CREATE OR REPLACE VIEW admin_dashboard_stats 
WITH (security_invoker = true) AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'USER') as total_users,
    (SELECT COUNT(*) FROM redeem_requests WHERE status = 'PENDING') as pending_requests,
    (SELECT COALESCE(SUM(amount_rupees), 0) FROM redeem_requests WHERE status = 'APPROVED') as total_paid,
    (SELECT COUNT(*) FROM custom_questions WHERE is_active = true) as total_questions,
    (SELECT COALESCE(SUM(points), 0) FROM users) as total_points_distributed;

-- View for user leaderboard
CREATE OR REPLACE VIEW user_leaderboard 
WITH (security_invoker = true) AS
SELECT 
    id,
    name,
    points,
    solved_count,
    RANK() OVER (ORDER BY points DESC) as rank
FROM users
WHERE role = 'USER'
ORDER BY points DESC
LIMIT 100;
