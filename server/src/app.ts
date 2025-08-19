import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import routes
import experimentTypeRoutes from './routes/experimentType.route';
import personnelRoutes from './routes/personnel.route';
import companyRoutes from './routes/company.route';
import applicationRoutes from './routes/application.route';
import userRoutes from './routes/user.route';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root routes
app.get('/', (_req, res) => {
  res.send('API up');
});

app.get('/api', (_req, res) => {
  res.json({ 
    ok: true, 
    message: 'TSE Automation API',
    endpoints: [
      'GET /api/health',
      'POST /api/users/login',
      'GET /api/experiment-types',
      'GET /api/personnel', 
      'GET /api/companies',
      'GET /api/users',
      'GET /api/applications/recent',
      'GET /api/applications/all',
      'POST /api/applications'
    ]
  });
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/api/experiment-types', experimentTypeRoutes);
app.use('/api/personnel', personnelRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);

// 404 handler
app.use((_req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Global error:', error);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
