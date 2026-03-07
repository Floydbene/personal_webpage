-- Rename todos table to tickets
ALTER TABLE todos RENAME TO tickets;

-- Add new ticket columns
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'open';
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'medium';
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS due_date timestamp;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS closed_at timestamp;

-- Update existing completed tickets to reflect new status
UPDATE tickets SET status = 'done', closed_at = updated_at WHERE completed = true;

-- Dog access rotation table
CREATE TABLE IF NOT EXISTS dog_access (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email text NOT NULL,
  window_start timestamp NOT NULL UNIQUE,
  window_end timestamp NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL
);
