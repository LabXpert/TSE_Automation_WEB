import { Router } from 'express';
import { ExperimentTypeService } from '../services/experimentType.service';

const router = Router();
const experimentTypeService = new ExperimentTypeService();

// GET /api/experiment-types
router.get('/', async (_req, res) => {
  try {
    const experimentTypes = await experimentTypeService.getAllExperimentTypes();
    res.json(experimentTypes);
  } catch (error) {
    console.error('Error fetching experiment types:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// GET /api/experiment-types/:id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid experiment type ID' });
    }
    
    const experimentType = await experimentTypeService.getExperimentTypeById(id);
    if (!experimentType) {
      return res.status(404).json({ error: 'Experiment type not found' });
    }
    
    res.json(experimentType);
  } catch (error) {
    console.error('Error fetching experiment type:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// POST /api/experiment-types
router.post('/', async (req, res) => {
  try {
    const { name, base_price, accredited_multiplier } = req.body;
    
    const experimentType = await experimentTypeService.createExperimentType({
      name,
      base_price: Number(base_price) || 0,
      accredited_multiplier: Number(accredited_multiplier) || 1.0
    });
    
    res.status(201).json(experimentType);
  } catch (error: any) {
    console.error('Error creating experiment type:', error);
    if (error.message.includes('required') || error.message.includes('cannot be negative')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Sunucu hatası' });
    }
  }
});

// PUT /api/experiment-types/:id
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid experiment type ID' });
    }
    
    const { name, base_price, accredited_multiplier } = req.body;
    
    const experimentType = await experimentTypeService.updateExperimentType(id, {
      name,
      base_price: Number(base_price) || 0,
      accredited_multiplier: Number(accredited_multiplier) || 1.0
    });
    
    res.json(experimentType);
  } catch (error: any) {
    console.error('Error updating experiment type:', error);
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes('required') || error.message.includes('cannot be negative')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Sunucu hatası' });
    }
  }
});

// DELETE /api/experiment-types/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid experiment type ID' });
    }
    
    await experimentTypeService.deleteExperimentType(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting experiment type:', error);
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Sunucu hatası' });
    }
  }
});

export default router;
