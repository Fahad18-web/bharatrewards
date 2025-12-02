-- Announcements table for Community Hub
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'INFO' CHECK (type IN ('INFO', 'WARNING', 'SUCCESS', 'EVENT')),
  is_active BOOLEAN DEFAULT true,
  is_pinned BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_pinned ON announcements(is_pinned);
CREATE INDEX IF NOT EXISTS idx_announcements_expires ON announcements(expires_at);

-- Enable Row Level Security
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can read active announcements" ON announcements;
DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;

-- Policy: Anyone can read active announcements
CREATE POLICY "Anyone can read active announcements" ON announcements
  FOR SELECT
  USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Policy: Only admins can manage announcements
CREATE POLICY "Admins can manage announcements" ON announcements
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );

-- ============================================
-- Feedback table for suggestions & feature requests
-- ============================================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'SUGGESTION' CHECK (type IN ('SUGGESTION', 'FEATURE_REQUEST', 'BUG_REPORT', 'OTHER')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'IMPLEMENTED', 'DECLINED')),
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for feedback
CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);

-- Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can read own feedback" ON feedback;
DROP POLICY IF EXISTS "Users can create feedback" ON feedback;
DROP POLICY IF EXISTS "Admins can manage all feedback" ON feedback;

-- Policy: Users can read their own feedback
CREATE POLICY "Users can read own feedback" ON feedback
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Users can create feedback
CREATE POLICY "Users can create feedback" ON feedback
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy: Admins can manage all feedback
CREATE POLICY "Admins can manage all feedback" ON feedback
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );
