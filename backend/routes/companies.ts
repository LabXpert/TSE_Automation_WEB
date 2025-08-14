import { Router } from 'express';
import { companyService } from '../services/companyService.ts';

const router = Router();

// Tüm firmaları getir
router.get('/', async (req, res) => {
  const result = await companyService.getAll();
  
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Yeni firma ekle
router.post('/', async (req, res) => {
  const result = await companyService.create(req.body);
  
  if (result.success) {
    res.status(201).json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

export default router;