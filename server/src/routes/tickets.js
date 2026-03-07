import { Router } from 'express';
import { eq, desc, inArray } from 'drizzle-orm';
import { db } from '../db/index.js';
import { tickets } from '../db/schema.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    let query = db.select().from(tickets);

    if (req.query.status) {
      const statuses = req.query.status.split(',');
      query = query.where(inArray(tickets.status, statuses));
    }

    const result = await query.orderBy(desc(tickets.createdAt));
    res.json(result);
  } catch (err) {
    console.error('Failed to fetch tickets:', err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

router.post('/', async (req, res) => {
  const { title, description, priority, assignedTo, dueDate } = req.body;
  if (!title?.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    const values = {
      userId: req.user.id,
      title: title.trim(),
      description: description?.trim() || null,
      priority: priority || 'medium',
      status: 'open',
      createdBy: req.user.email,
      assignedTo: assignedTo?.trim() || req.user.email,
      dueDate: dueDate ? new Date(dueDate) : null,
    };
    const [ticket] = await db.insert(tickets).values(values).returning();
    res.status(201).json(ticket);
  } catch (err) {
    console.error('Failed to create ticket:', err);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, assignedTo, dueDate } = req.body;
  try {
    const updates = { updatedAt: new Date() };
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description?.trim() || null;
    if (priority !== undefined) updates.priority = priority;
    if (assignedTo !== undefined) updates.assignedTo = assignedTo?.trim() || null;
    if (dueDate !== undefined) updates.dueDate = dueDate ? new Date(dueDate) : null;

    if (status !== undefined) {
      updates.status = status;
      if (status === 'done' || status === 'closed') {
        updates.closedAt = new Date();
        updates.completedBy = req.user.email;
        updates.completed = true;
      } else {
        updates.closedAt = null;
        updates.completedBy = null;
        updates.completed = false;
      }
    }

    const [ticket] = await db
      .update(tickets)
      .set(updates)
      .where(eq(tickets.id, id))
      .returning();

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (err) {
    console.error('Failed to update ticket:', err);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [ticket] = await db
      .delete(tickets)
      .where(eq(tickets.id, id))
      .returning();

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Failed to delete ticket:', err);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

export default router;
