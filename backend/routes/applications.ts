import { Router } from 'express';
import { applicationService } from '../services/applicationService.ts';

const router = Router();

// Tüm başvuruları getir (testler ile birlikte)
router.get('/', async (req, res) => {
  const result = await applicationService.getAll();
  
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Yeni başvuru ekle (testler ile birlikte)
router.post('/', async (req, res) => {
  const result = await applicationService.create(req.body);
  
  if (result.success) {
    res.status(201).json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Başvuru güncelle
router.put('/:id', async (req, res) => {
  console.log('PUT route çağrıldı:', req.params.id, req.body);
  const result = await applicationService.update(req.params.id, req.body);
  
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Başvuru sil
router.delete('/:id', async (req, res) => {
  const result = await applicationService.delete(req.params.id);
  
  if (result.success) {
    res.json({ success: true, message: 'Başvuru başarıyla silindi' });
  } else {
    res.status(500).json({ error: result.error });
  }
});

export default router;