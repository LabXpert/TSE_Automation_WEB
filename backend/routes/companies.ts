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

// ID'ye göre firma getir
router.get('/:id', async (req, res) => {
  const result = await companyService.getById(req.params.id);
  
  if (result.success) {
    if (result.data) {
      res.json(result.data);
    } else {
      res.status(404).json({ error: 'Firma bulunamadı' });
    }
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Firma güncelle
router.put('/:id', async (req, res) => {
  const result = await companyService.update(req.params.id, req.body);
  
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Firma sil
router.delete('/:id', async (req, res) => {
  const result = await companyService.delete(req.params.id);
  
  if (result.success) {
    res.json({ success: true, message: 'Firma başarıyla silindi' });
  } else {
    res.status(500).json({ error: result.error });
  }
});

export default router;