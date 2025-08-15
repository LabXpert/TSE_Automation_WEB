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
                'unit_price', t.unit_price,
                'is_accredited', COALESCE(t.is_accredited, false)
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
      is_accredited?: boolean;
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
        try {
          // is_accredited alanını test et, yoksa normal insert yap
          await client.query(
            'INSERT INTO tests (application_id, experiment_type_id, responsible_personnel_id, unit_price, is_accredited) VALUES ($1, $2, $3, $4, $5)',
            [applicationId, test.experiment_type_id, test.responsible_personnel_id, test.unit_price, test.is_accredited || false]
          );
        } catch (error) {
          // is_accredited kolonu yoksa eski şekilde insert yap
          await client.query(
            'INSERT INTO tests (application_id, experiment_type_id, responsible_personnel_id, unit_price) VALUES ($1, $2, $3, $4)',
            [applicationId, test.experiment_type_id, test.responsible_personnel_id, test.unit_price]
          );
        }
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
  },

  // Başvuru güncelle
  async update(id: string, applicationData: {
    company_id?: number;
    application_no?: string;
    application_date?: string;
    certification_type?: string;
    test_count?: number;
  }) {
    try {
      const { 
        company_id, 
        application_no, 
        application_date, 
        certification_type, 
        test_count 
      } = applicationData;
      
      const result = await pool.query(
        'UPDATE applications SET company_id = COALESCE($1, company_id), application_no = COALESCE($2, application_no), application_date = COALESCE($3, application_date), certification_type = COALESCE($4, certification_type), test_count = COALESCE($5, test_count) WHERE id = $6 RETURNING *',
        [company_id, application_no, application_date, certification_type, test_count, id]
      );
      
      if (result.rowCount === 0) {
        return {
          success: false,
          error: 'Güncellenecek başvuru bulunamadı'
        };
      }
      
      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      console.error('Application update error:', error);
      return {
        success: false,
        error: 'Başvuru güncellenirken hata oluştu'
      };
    }
  },

  // Başvuru sil (testleri de siler)
  async delete(id: string) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Önce testleri sil
      await client.query('DELETE FROM tests WHERE application_id = $1', [id]);
      
      // Sonra başvuruyu sil
      const result = await client.query('DELETE FROM applications WHERE id = $1', [id]);
      
      if (result.rowCount === 0) {
        await client.query('ROLLBACK');
        return {
          success: false,
          error: 'Silinecek başvuru bulunamadı'
        };
      }
      
      await client.query('COMMIT');
      
      return {
        success: true,
        data: null
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Application delete error:', error);
      return {
        success: false,
        error: 'Başvuru silinirken hata oluştu'
      };
    } finally {
      client.release();
    }
  }
};