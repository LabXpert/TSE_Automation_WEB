// backend/services/applicationService.ts
import { pool } from '../db.ts';

export const applicationService = {
  // Tüm başvuruları getir (testler ile birlikte)
  async getAll() {
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
      
      return {
        success: true,
        data: result.rows
      };
    } catch (error) {
      console.error('Application getAll error:', error);
      return {
        success: false,
        error: 'Başvurular alınırken hata oluştu'
      };
    }
  },

  // Yeni başvuru ekle (testler ile birlikte)
  async create(applicationData: {
    company_id: number;
    application_no: string;
    application_date: string;
    certification_type: string;
    test_count: number;
    tests: Array<{
      experiment_type_id: number;
      responsible_personnel_id: number;
      unit_price: number;
    }>;
  }) {
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
      } = applicationData;
      
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
      
      return {
        success: true,
        data: finalResult.rows[0]
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Application create error:', error);
      return {
        success: false,
        error: 'Başvuru eklenirken hata oluştu'
      };
    } finally {
      client.release();
    }
  }
};