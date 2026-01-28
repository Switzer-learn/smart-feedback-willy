DROP TABLE IF exists feedback;

CREATE TABLE feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    priority TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
-- Add the feedback table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE feedback;

-- 1. SELECT: Users can only see their own rows
CREATE POLICY "Users can view own feedback"
    ON feedback FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- 2. INSERT: Users can only insert if the user_id matches their own ID
-- Note the use of WITH CHECK here
CREATE POLICY "Users can insert own feedback"
    ON feedback FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);