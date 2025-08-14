import { Router } from 'express';
import { experimentTypeService } from '../services/experimentTypeService.ts';

const router = Router();

// Tüm deney türlerini getir
router.get('/', async (req, res) => {
  const result = await experimentTypeService.getAll();
  
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

export default router;