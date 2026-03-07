import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const tickets = pgTable('tickets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  title: text('title').notNull(),
  completed: boolean('completed').default(false).notNull(),
  status: text('status').default('open').notNull(),
  priority: text('priority').default('medium').notNull(),
  description: text('description'),
  dueDate: timestamp('due_date'),
  closedAt: timestamp('closed_at'),
  createdBy: text('created_by'),
  completedBy: text('completed_by'),
  assignedTo: text('assigned_to'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const profiles = pgTable('profiles', {
  userId: uuid('user_id').primaryKey(),
  email: text('email').notNull(),
  displayName: text('display_name').notNull(),
});

export const notes = pgTable('notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  content: text('content').notNull(),
  createdBy: text('created_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const dogAccess = pgTable('dog_access', {
  id: uuid('id').defaultRandom().primaryKey(),
  userEmail: text('user_email').notNull(),
  windowStart: timestamp('window_start').notNull(),
  windowEnd: timestamp('window_end').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
