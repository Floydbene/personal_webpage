import { Router } from 'express';
import { sql } from 'drizzle-orm';
import { db } from '../db/index.js';

const router = Router();

const WINDOW_MS = 30 * 60 * 1000; // 30 minutes

router.get('/access', async (req, res) => {
  try {
    const now = Date.now();
    const windowIndex = Math.floor(now / WINDOW_MS);
    const windowStart = new Date(windowIndex * WINDOW_MS).toISOString();
    const windowEnd = new Date((windowIndex + 1) * WINDOW_MS).toISOString();

    // Check if we already have an entry for this window
    const existing = await db.execute(
      sql`SELECT user_email FROM dog_access WHERE window_start = ${windowStart} LIMIT 1`
    );

    if (existing.length > 0) {
      return res.json({
        hasAccess: existing[0].user_email === req.user.email,
        currentHolder: existing[0].user_email,
        windowEnd,
      });
    }

    // Get all users to pick from
    const users = await db.execute(
      sql`SELECT email FROM auth.users ORDER BY email`
    );

    if (users.length === 0) {
      return res.status(500).json({ error: 'No users found' });
    }

    // Deterministic selection based on window index
    const selectedEmail = users[windowIndex % users.length].email;

    // Insert with conflict handling for race conditions
    await db.execute(
      sql`INSERT INTO dog_access (user_email, window_start, window_end)
          VALUES (${selectedEmail}, ${windowStart}::timestamp, ${windowEnd}::timestamp)
          ON CONFLICT (window_start) DO NOTHING`
    );

    // Re-fetch to handle race condition (another request may have inserted first)
    const result = await db.execute(
      sql`SELECT user_email FROM dog_access WHERE window_start = ${windowStart} LIMIT 1`
    );

    const holder = result[0]?.user_email || selectedEmail;

    res.json({
      hasAccess: holder === req.user.email,
      currentHolder: holder,
      windowEnd,
    });
  } catch (err) {
    console.error('Failed to check dog access:', err);
    res.status(500).json({ error: 'Failed to check dog access' });
  }
});

export default router;
