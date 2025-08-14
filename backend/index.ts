import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './db.ts';
import companiesRoutes from './routes/companies.ts';
import personnelRoutes from './routes/personnel.ts';
import experimentTypesRoutes from './routes/experiment-types.ts';
import applicationsRoutes from './routes/applications.ts';
import usersRoutes from './routes/users.ts';

// Environment variables yükle
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/companies', companiesRoutes);
app.use('/api/personnel', personnelRoutes);
app.use('/api/experiment-types', experimentTypesRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/users', usersRoutes);

// Basit health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TSE Backend API çalışıyor',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/health',
      'GET /api/companies',
      'POST /api/companies', 
      'GET /api/personnel',
      'GET /api/experiment-types',
      'GET /api/applications',
      'POST /api/applications',
      'GET /api/users'
    ]
  });
});

// Server başlat
app.listen(PORT, async () => {
  console.log(`🚀 Backend server http://localhost:${PORT} adresinde çalışıyor`);
  await testConnection();
});

export default app;