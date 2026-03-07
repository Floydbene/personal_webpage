import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import ticketsRouter from './routes/tickets.js';
import notesRouter from './routes/notes.js';
import usersRouter from './routes/users.js';
import dogRouter from './routes/dog.js';
import { auth } from './middleware/auth.js';
import { db } from './db/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  })
);
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await db.execute('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    console.error('Health check DB error:', err);
    res.status(500).json({ status: 'error', db: 'disconnected', message: err.message });
  }
});

app.use('/api/tickets', auth, ticketsRouter);
app.use('/api/notes', auth, notesRouter);
app.use('/api/users', auth, usersRouter);
app.use('/api/dog', auth, dogRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
