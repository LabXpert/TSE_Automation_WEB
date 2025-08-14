import { Router } from 'express';
import { personnelService } from '../services/personnelService.ts';

const router = Router();

// Tüm personelleri getir
router.get('/', async (req, res) => {
  const result = await personnelService.getAll();
  
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

export default router;