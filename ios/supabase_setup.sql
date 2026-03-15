-- =============================================================
-- Supabase RLS Policies & RPC Functions
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- =============================================================

-- 1. Enable RLS on all tables
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dog_access ENABLE ROW LEVEL SECURITY;

-- 2. Tickets policies
DROP POLICY IF EXISTS "tickets_select" ON tickets;
DROP POLICY IF EXISTS "tickets_insert" ON tickets;
DROP POLICY IF EXISTS "tickets_update" ON tickets;
DROP POLICY IF EXISTS "tickets_delete" ON tickets;

CREATE POLICY "tickets_select" ON tickets
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "tickets_insert" ON tickets
    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "tickets_update" ON tickets
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "tickets_delete" ON tickets
    FOR DELETE TO authenticated USING (true);

-- 3. Notes policies
DROP POLICY IF EXISTS "notes_select" ON notes;
DROP POLICY IF EXISTS "notes_insert" ON notes;
DROP POLICY IF EXISTS "notes_delete" ON notes;
-- Drop any existing owner-only policy
DROP POLICY IF EXISTS "notes_owner" ON notes;
DROP POLICY IF EXISTS "Users can manage their own notes" ON notes;

CREATE POLICY "notes_select" ON notes
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "notes_insert" ON notes
    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "notes_delete" ON notes
    FOR DELETE TO authenticated USING (true);

-- 4. Profiles policies
DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;

CREATE POLICY "profiles_select" ON profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "profiles_insert" ON profiles
    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "profiles_update" ON profiles
    FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- 5. Dog access policies
DROP POLICY IF EXISTS "dog_access_select" ON dog_access;
DROP POLICY IF EXISTS "dog_access_insert" ON dog_access;

CREATE POLICY "dog_access_select" ON dog_access
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "dog_access_insert" ON dog_access
    FOR INSERT TO authenticated WITH CHECK (true);

-- 6. Unique constraint on window_start (needed for ON CONFLICT)
CREATE UNIQUE INDEX IF NOT EXISTS dog_access_window_start_idx ON dog_access (window_start);

-- 7. RPC: get_dog_access
--    Replicates the Express 30-minute rotation logic.
--    Uses SECURITY DEFINER to access auth.users.
CREATE OR REPLACE FUNCTION get_dog_access()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    window_ms bigint := 30 * 60;  -- 30 minutes in seconds
    now_epoch bigint;
    window_idx bigint;
    w_start timestamptz;
    w_end timestamptz;
    selected_email text;
    holder_email text;
    user_count int;
    caller_email text;
BEGIN
    -- Get caller's email
    SELECT email INTO caller_email FROM auth.users WHERE id = auth.uid();

    now_epoch := EXTRACT(EPOCH FROM now())::bigint;
    window_idx := now_epoch / window_ms;
    w_start := to_timestamp(window_idx * window_ms);
    w_end := to_timestamp((window_idx + 1) * window_ms);

    -- Check if we already have an entry for this window
    SELECT user_email INTO holder_email
    FROM dog_access
    WHERE window_start = w_start
    LIMIT 1;

    IF holder_email IS NOT NULL THEN
        RETURN jsonb_build_object(
            'hasAccess', (holder_email = caller_email),
            'currentHolder', holder_email,
            'windowEnd', to_char(w_end AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
        );
    END IF;

    -- Get user count for deterministic rotation
    SELECT count(*) INTO user_count FROM auth.users;

    IF user_count = 0 THEN
        RAISE EXCEPTION 'No users found';
    END IF;

    -- Deterministic selection based on window index
    SELECT email INTO selected_email
    FROM auth.users
    ORDER BY email
    OFFSET (window_idx % user_count)
    LIMIT 1;

    -- Insert with conflict handling for race conditions
    INSERT INTO dog_access (user_email, window_start, window_end)
    VALUES (selected_email, w_start, w_end)
    ON CONFLICT (window_start) DO NOTHING;

    -- Re-fetch to handle race condition
    SELECT user_email INTO holder_email
    FROM dog_access
    WHERE window_start = w_start
    LIMIT 1;

    IF holder_email IS NULL THEN
        holder_email := selected_email;
    END IF;

    RETURN jsonb_build_object(
        'hasAccess', (holder_email = caller_email),
        'currentHolder', holder_email,
        'windowEnd', to_char(w_end AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
    );
END;
$$;

-- 8. RPC: get_users
--    Returns all users with display names (joins auth.users with profiles).
--    Uses SECURITY DEFINER to access auth.users.
CREATE OR REPLACE FUNCTION get_users()
RETURNS TABLE(email text, display_name text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT u.email::text, p.display_name
    FROM auth.users u
    LEFT JOIN profiles p ON p.user_id = u.id
    ORDER BY u.email;
$$;
