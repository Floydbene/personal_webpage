-- Add new columns to todos table
ALTER TABLE todos ADD COLUMN IF NOT EXISTS created_by TEXT;
ALTER TABLE todos ADD COLUMN IF NOT EXISTS completed_by TEXT;
ALTER TABLE todos ADD COLUMN IF NOT EXISTS assigned_to TEXT;

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes (user_id);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notes"
  ON notes
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
