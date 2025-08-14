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


// --- PERSONNEL LIST ---
app.get('/api/personnel', async (_req, res) => {
  try {
    const items = await prisma.personnel.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching personnel:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// --- COMPANIES LIST ---
app.get('/api/companies', async (_req, res) => {
  try {
    const items = await prisma.companies.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- ADD COMPANY ---

// --- ADD COMPANY ---
app.post('/api/companies', async (req, res) => {
  try {
    const { name, tax_no, contact_name, address, phone, email } = req.body;
    if (!name || !tax_no || !contact_name || !address || !phone || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newCompany = await prisma.companies.create({
      data: {
        name,
        tax_no,
        contact_name,
        address,
        phone,
        email
      }
    });
    res.status(201).json(newCompany);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- DELETE COMPANY ---
app.delete('/api/companies/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid company id' });
    await prisma.companies.delete({ where: { id } });
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- UPDATE COMPANY ---
app.put('/api/companies/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, tax_no, contact_name, address, phone, email } = req.body;
    if (!id || !name || !tax_no || !contact_name || !address || !phone || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const updatedCompany = await prisma.companies.update({
      where: { id },
      data: {
        name,
        tax_no,
        contact_name,
        address,
        phone,
        email
      }
    });
    res.json(updatedCompany);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
