import { Router } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import { notes } from '../db/schema.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const userNotes = await db
      .select()
      .from(notes)
      .where(eq(notes.userId, req.user.id))
      .orderBy(notes.createdAt);
    res.json(userNotes);
  } catch (err) {
    console.error('Failed to fetch notes:', err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

router.post('/', async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) {
    return res.status(400).json({ error: 'Content is required' });
  }
  try {
    const [note] = await db
      .insert(notes)
      .values({
        userId: req.user.id,
        content: content.trim(),
        createdBy: req.user.email,
      })
      .returning();
    res.status(201).json(note);
  } catch (err) {
    console.error('Failed to create note:', err);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [note] = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, req.user.id)))
      .returning();

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Failed to delete note:', err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;
