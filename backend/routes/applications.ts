import { Router } from 'express';
import { pool } from '../db.ts';

const router = Router();

// Tüm başvuruları getir (testler ile birlikte)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', t.id,
              'experiment_type_id', t.experiment_type_id,
              'responsible_personnel_id', t.responsible_personnel_id,
              'unit_price', t.unit_price
            )
          ) FILTER (WHERE t.id IS NOT NULL), 
          '[]'
        ) as tests
      FROM applications a
      LEFT JOIN tests t ON a.id = t.application_id
      GROUP BY a.id
      ORDER BY a.id DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Başvuru listesi hatası:', error);
    res.status(500).json({ error: 'Başvurular alınırken hata oluştu' });
  }
});

// Yeni başvuru ekle (testler ile birlikte)
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { 
      company_id, 
      application_no, 
      application_date, 
      certification_type, 
      test_count,
      tests 
    } = req.body;
    
    // Başvuruyu ekle
    const applicationResult = await client.query(
      'INSERT INTO applications (company_id, application_no, application_date, certification_type, test_count) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [company_id, application_no, application_date, certification_type, test_count]
    );
    
    const applicationId = applicationResult.rows[0].id;
    
    // Testleri ekle
    for (const test of tests) {
      await client.query(
        'INSERT INTO tests (application_id, experiment_type_id, responsible_personnel_id, unit_price) VALUES ($1, $2, $3, $4)',
        [applicationId, test.experiment_type_id, test.responsible_personnel_id, test.unit_price]
      );
    }
    
    await client.query('COMMIT');
    
    // Eklenen başvuruyu testler ile birlikte getir
    const finalResult = await client.query(`
      SELECT 
        a.*,
        json_agg(
          json_build_object(
            'id', t.id,
            'experiment_type_id', t.experiment_type_id,
            'responsible_personnel_id', t.responsible_personnel_id,
            'unit_price', t.unit_price
          )
        ) as tests
      FROM applications a
      LEFT JOIN tests t ON a.id = t.application_id
      WHERE a.id = $1
      GROUP BY a.id
    `, [applicationId]);
    
    res.status(201).json(finalResult.rows[0]);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Başvuru ekleme hatası:', error);
    res.status(500).json({ error: 'Başvuru eklenirken hata oluştu' });
  } finally {
    client.release();
  }
});

export default router;