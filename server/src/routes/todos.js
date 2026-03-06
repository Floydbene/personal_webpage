import { Router } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import { todos } from '../db/schema.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const userTodos = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, req.user.id))
      .orderBy(todos.createdAt);
    res.json(userTodos);
  } catch (err) {
    console.error('Failed to fetch todos:', err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title?.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    const [todo] = await db
      .insert(todos)
      .values({ userId: req.user.id, title: title.trim() })
      .returning();
    res.status(201).json(todo);
  } catch (err) {
    console.error('Failed to create todo:', err);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  try {
    const updates = { updatedAt: new Date() };
    if (title !== undefined) updates.title = title.trim();
    if (completed !== undefined) updates.completed = completed;

    const [todo] = await db
      .update(todos)
      .set(updates)
      .where(and(eq(todos.id, id), eq(todos.userId, req.user.id)))
      .returning();

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (err) {
    console.error('Failed to update todo:', err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [todo] = await db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, req.user.id)))
      .returning();

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Failed to delete todo:', err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

export default router;
