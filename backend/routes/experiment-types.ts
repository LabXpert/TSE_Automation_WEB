import { Router } from 'express';
import { pool } from '../db.ts';

const router = Router();

// Tüm deney türlerini getir
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM experiment_types ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Deney türleri hatası:', error);
    res.status(500).json({ error: 'Deney türleri alınırken hata oluştu' });
  }
});

export default router;