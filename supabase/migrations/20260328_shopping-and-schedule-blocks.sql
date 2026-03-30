-- =============================================================
-- Shopping Items & Schedule Blocks
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- =============================================================

-- 1. Shopping Items table
CREATE TABLE IF NOT EXISTS shopping_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  store text,
  estimated_cost numeric(10,2),
  quantity integer DEFAULT 1,
  needed_by date,
  purchased boolean DEFAULT false,
  purchased_by text,
  purchased_at timestamptz,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Schedule Blocks table
CREATE TABLE IF NOT EXISTS schedule_blocks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL CHECK (end_date >= start_date),
  color text DEFAULT '#569cd6',
  ticket_id uuid REFERENCES tickets(id) ON DELETE SET NULL,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS schedule_blocks_date_range_idx ON schedule_blocks (start_date, end_date);
CREATE INDEX IF NOT EXISTS schedule_blocks_ticket_id_idx ON schedule_blocks (ticket_id);

-- 4. Enable RLS
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_blocks ENABLE ROW LEVEL SECURITY;

-- 5. Shopping Items policies (same pattern as tickets)
DROP POLICY IF EXISTS "shopping_items_select" ON shopping_items;
DROP POLICY IF EXISTS "shopping_items_insert" ON shopping_items;
DROP POLICY IF EXISTS "shopping_items_update" ON shopping_items;
DROP POLICY IF EXISTS "shopping_items_delete" ON shopping_items;

CREATE POLICY "shopping_items_select" ON shopping_items
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "shopping_items_insert" ON shopping_items
    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "shopping_items_update" ON shopping_items
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "shopping_items_delete" ON shopping_items
    FOR DELETE TO authenticated USING (true);

-- 6. Schedule Blocks policies (same pattern as tickets)
DROP POLICY IF EXISTS "schedule_blocks_select" ON schedule_blocks;
DROP POLICY IF EXISTS "schedule_blocks_insert" ON schedule_blocks;
DROP POLICY IF EXISTS "schedule_blocks_update" ON schedule_blocks;
DROP POLICY IF EXISTS "schedule_blocks_delete" ON schedule_blocks;

CREATE POLICY "schedule_blocks_select" ON schedule_blocks
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "schedule_blocks_insert" ON schedule_blocks
    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "schedule_blocks_update" ON schedule_blocks
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "schedule_blocks_delete" ON schedule_blocks
    FOR DELETE TO authenticated USING (true);
