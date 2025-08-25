import { Router } from 'express';
import { ApplicationService } from '../services/application.service';

const router = Router();
const applicationService = new ApplicationService();

// GET /api/applications/recent
router.get('/recent', async (_req, res) => {
  try {
    const applications = await applicationService.getRecentApplications(5);
    res.json(applications);
  } catch (error) {
    console.error('Error fetching recent applications:', error);
    res.status(500).json({ error: 'Sunucu hatasıı' });
  }
});

// GET /api/applications/all
router.get('/all', async (_req, res) => {
  try {
    const applications = await applicationService.getAllApplications();
    res.json(applications);
  } catch (error) {
    console.error('Error fetching all applications:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Helper function to normalize booleans
const toBool = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return Boolean(value);
};

// POST /api/applications
router.post('/', async (req, res) => {
  try {
    const { company_id, application_no, application_date, certification_type, tests } = req.body;
    
    const application = await applicationService.createApplication({
      company_id: Number(company_id),
      application_no,
      application_date,
      certification_type,
      tests: tests.map((test: any) => ({
        experiment_type_id: Number(test.experiment_type_id),
        responsible_personnel_id: Number(test.responsible_personnel_id),
        unit_price: Number(test.unit_price) || 0, // Client'tan gelse de server hesaplayacak
        sample_count: Number(test.sample_count) || 1, // Yeni alan
        is_accredited: toBool(test.is_accredited),
        uygunluk: toBool(test.uygunluk)
      }))
    });
    
    res.status(201).json(application);
  } catch (error: any) {
    console.error('Error creating application:', error);
    if (error.message.includes('required') || error.message.includes('format') || error.message.includes('Test')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Sunucu hatası' });
    }
  }
});

// PUT /api/applications/:id
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid application ID' });
    }
    
    const { company_id, application_no, application_date, certification_type, tests } = req.body;
    
    const application = await applicationService.updateApplication(id, {
      company_id: Number(company_id),
      application_no,
      application_date,
      certification_type,
      tests: tests.map((test: any) => ({
        experiment_type_id: Number(test.experiment_type_id),
        responsible_personnel_id: Number(test.responsible_personnel_id),
        unit_price: Number(test.unit_price) || 0, // Client'tan gelse de server hesaplayacak
        sample_count: Number(test.sample_count) || 1, // Yeni alan
        is_accredited: toBool(test.is_accredited),
        uygunluk: toBool(test.uygunluk)
      }))
    });
    
    res.json(application);
  } catch (error: any) {
    console.error('Error updating application:', error);
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes('required') || error.message.includes('format') || error.message.includes('Test')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Sunucu hatası' });
    }
  }
});

// DELETE /api/applications/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid application ID' });
    }
    
    await applicationService.deleteApplication(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting application:', error);
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Sunucu hatası' });
    }
  }
});

export default router;
