import { Router } from 'express';
import { eq, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { profiles } from '../db/schema.js';

const router = Router();

// Get all users with display names
router.get('/', async (_req, res) => {
  try {
    const result = await db.execute(
      sql`SELECT u.email, p.display_name
          FROM auth.users u
          LEFT JOIN profiles p ON p.user_id = u.id
          ORDER BY u.email`
    );
    res.json(result.map((r) => ({ email: r.email, displayName: r.display_name || null })));
  } catch (err) {
    console.error('Failed to fetch users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get own profile
router.get('/me', async (req, res) => {
  try {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, req.user.id));
    res.json(profile || { userId: req.user.id, email: req.user.email, displayName: null });
  } catch (err) {
    console.error('Failed to fetch profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Set display name
router.put('/me', async (req, res) => {
  const { displayName } = req.body;
  if (!displayName?.trim()) {
    return res.status(400).json({ error: 'Display name is required' });
  }
  try {
    const [profile] = await db
      .insert(profiles)
      .values({ userId: req.user.id, email: req.user.email, displayName: displayName.trim() })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: { displayName: displayName.trim(), email: req.user.email },
      })
      .returning();
    res.json(profile);
  } catch (err) {
    console.error('Failed to update profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
