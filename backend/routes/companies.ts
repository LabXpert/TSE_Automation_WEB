import { Router } from 'express';
import { pool } from '../db.ts';

const router = Router();

// Tüm firmaları getir
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM companies ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Firma listesi hatası:', error);
    res.status(500).json({ error: 'Firmalar alınırken hata oluştu' });
  }
});

// Yeni firma ekle
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, contact_name, tax_no } = req.body;
    const result = await pool.query(
      'INSERT INTO companies (name, email, phone, address, contact_name, tax_no) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone, address, contact_name, tax_no]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Firma ekleme hatası:', error);
    res.status(500).json({ error: 'Firma eklenirken hata oluştu' });
  }
});

export default router;