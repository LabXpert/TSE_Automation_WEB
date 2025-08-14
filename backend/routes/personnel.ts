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

// ID'ye göre personel getir
router.get('/:id', async (req, res) => {
  const result = await personnelService.getById(req.params.id);
  
  if (result.success) {
    if (result.data) {
      res.json(result.data);
    } else {
      res.status(404).json({ error: 'Personel bulunamadı' });
    }
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Yeni personel ekle
router.post('/', async (req, res) => {
  const result = await personnelService.create(req.body);
  
  if (result.success) {
    res.status(201).json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Personel güncelle
router.put('/:id', async (req, res) => {
  const result = await personnelService.update(req.params.id, req.body);
  
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Personel sil
router.delete('/:id', async (req, res) => {
  const result = await personnelService.delete(req.params.id);
  
  if (result.success) {
    res.status(204).send();
  } else {
    res.status(500).json({ error: result.error });
  }
});

export default router;