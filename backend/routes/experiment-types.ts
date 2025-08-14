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

// ID'ye göre deney türü getir
router.get('/:id', async (req, res) => {
  const result = await experimentTypeService.getById(req.params.id);
  
  if (result.success) {
    if (result.data) {
      res.json(result.data);
    } else {
      res.status(404).json({ error: 'Deney türü bulunamadı' });
    }
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Yeni deney türü ekle
router.post('/', async (req, res) => {
  const result = await experimentTypeService.create(req.body);
  
  if (result.success) {
    res.status(201).json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Deney türü güncelle
router.put('/:id', async (req, res) => {
  const result = await experimentTypeService.update(req.params.id, req.body);
  
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Deney türü sil
router.delete('/:id', async (req, res) => {
  const result = await experimentTypeService.delete(req.params.id);
  
  if (result.success) {
    res.status(204).send();
  } else {
    res.status(500).json({ error: result.error });
  }
});

export default router;