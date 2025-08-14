import { Router } from 'express';
import { pool } from '../db.ts';

const router = Router();

// Tüm kullanıcıları getir
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Kullanıcı listesi hatası:', error);
    res.status(500).json({ error: 'Kullanıcılar alınırken hata oluştu' });
  }
});

export default router;