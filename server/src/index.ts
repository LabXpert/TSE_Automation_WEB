import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

// --- ROOT ---
app.get('/', (_req, res) => {
  res.send('API up');
});

// --- /api KÖK ---
app.get('/api', (_req, res) => {
  res.json({ ok: true, hint: 'try /api/health or /api/experiment-types' });
});

// --- HEALTH ---
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// --- EXPERIMENT TYPES LIST ---
app.get('/api/experiment-types', async (_req, res) => {
  try {
    const items = await prisma.experiment_types.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching experiment_types:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
