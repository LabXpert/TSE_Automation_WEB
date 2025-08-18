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
      return res.status(400).json({ error: 'Geçersiz deney türü ID' });
    }
    
    const experimentType = await experimentTypeService.getExperimentTypeById(id);
    if (!experimentType) {
      return res.status(404).json({ error: 'Deney türü bulunamadı' });
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
    const { name, base_price } = req.body;
    
    console.log('Creating experiment type with data:', { name, base_price });
    
    const experimentType = await experimentTypeService.createExperimentType({
      name,
      base_price: Number(base_price) || 0
    });
    
    console.log('Experiment type created successfully:', experimentType);
    res.status(201).json(experimentType);
  } catch (error: any) {
    console.error('Error creating experiment type:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      constraint: error.constraint,
      detail: error.detail
    });
    
    if (error.message.includes('gerekli') || 
        error.message.includes('required') || 
        error.message.includes('negatif') || 
        error.message.includes('negative')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Sunucu hatası: ' + error.message });
    }
  }
});

// PUT /api/experiment-types/:id
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Geçersiz deney türü ID' });
    }
    
    const { name, base_price } = req.body;
    
    const experimentType = await experimentTypeService.updateExperimentType(id, {
      name,
      base_price: Number(base_price) || 0
    });
    
    res.json(experimentType);
  } catch (error: any) {
    console.error('Error updating experiment type:', error);
    if (error.message.includes('bulunamadı') || error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes('gerekli') || 
               error.message.includes('required') || 
               error.message.includes('negatif') || 
               error.message.includes('negative')) {
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
      return res.status(400).json({ error: 'Geçersiz deney türü ID' });
    }
    
    await experimentTypeService.deleteExperimentType(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting experiment type:', error);
    if (error.message.includes('bulunamadı') || error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Sunucu hatası' });
    }
  }
});

export default router;
