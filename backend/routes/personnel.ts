import { Router } from 'express';
import { pool } from '../db.ts';

const router = Router();

// Tüm personelleri getir
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM personnel ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Personel listesi hatası:', error);
    res.status(500).json({ error: 'Personeller alınırken hata oluştu' });
  }
});

export default router;