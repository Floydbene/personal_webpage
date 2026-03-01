-- Run this in your Supabase SQL Editor to create the todos table

CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);

-- Index for faster user-specific queries
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos (user_id);

-- Enable Row Level Security (optional extra layer — the API already filters by user_id)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own todos"
  ON todos
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
