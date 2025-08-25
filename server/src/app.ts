import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import routes
import experimentTypeRoutes from './routes/experimentType.route';
import personnelRoutes from './routes/personnel.route';
import companyRoutes from './routes/company.route';
import applicationRoutes from './routes/application.route';
import userRoutes from './routes/user.route';
import calibrationOrgRoutes from './routes/calibrationOrg.route';
import machineRoutes from './routes/machine.route';
import machineCalibrationRoutes from './routes/machineCalibration.route';
import machineReportRoutes from './routes/machineReport.route';
import alertRoutes from './routes/alert.route';

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
      'POST /api/applications',
      'GET /api/calibration-orgs',
      'POST /api/calibration-orgs',
      'GET /api/machines',
      'POST /api/machines',
      'GET /api/machines/expiring',
      'GET /api/machines/stats',
      'GET /api/machine-calibrations',
      'POST /api/machine-calibrations',
      'POST /api/machine-calibrations/calibrate/:machineId',
      'GET /api/machine-calibrations/stats',
      'GET /api/machine-reports/data',
      'GET /api/machine-reports/stats',
      'GET /api/machine-reports/top-used',
      'GET /api/machine-reports/calibration-status',
      'GET /api/alerts/calibration',
      'GET /api/alerts/calibration/summary'
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
app.use('/api/calibration-orgs', calibrationOrgRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/machine-calibrations', machineCalibrationRoutes);
app.use('/api/machine-reports', machineReportRoutes);
app.use('/api/alerts', alertRoutes);

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
