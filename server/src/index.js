import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import todosRouter from './routes/todos.js';
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

app.use('/api/todos', auth, todosRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
