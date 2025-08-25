import pool from '../database/connection';

export interface ApplicationData {
  company_id: number;
  application_no: string;
  application_date: string;
  certification_type: string;
  tests: TestData[];
}

export interface TestData {
  experiment_type_id: number;
  responsible_personnel_id: number;
  unit_price: number;
  sample_count?: number;
  total_price?: number;
  is_accredited: boolean;
  uygunluk: boolean;
}

export class ApplicationRepository {
  async findRecent(limit: number = 5) {
    const result = await pool.query(`
      SELECT 
        a.*,
        c.name as company_name, c.tax_no, c.contact_name, c.address, c.phone, c.email,
        COALESCE(
          json_agg(
            json_build_object(
              'id', t.id,
              'experiment_type_id', t.experiment_type_id,
              'responsible_personnel_id', t.responsible_personnel_id,
              'unit_price', t.unit_price,
              'sample_count', t.sample_count,
              'total_price', t.total_price,
              'is_accredited', t.is_accredited,
              'uygunluk', t.uygunluk,
              'created_at', t.created_at,
              'experiment_type_name', et.name,
              'experiment_type_base_price', et.base_price,
              'personnel_first_name', p.first_name,
              'personnel_last_name', p.last_name,
              'personnel_title', p.title
            )
          ) FILTER (WHERE t.id IS NOT NULL), '[]'::json
        ) as tests
      FROM applications a
      LEFT JOIN companies c ON a.company_id = c.id
      LEFT JOIN tests t ON a.id = t.application_id
      LEFT JOIN experiment_types et ON t.experiment_type_id = et.id
      LEFT JOIN personnel p ON t.responsible_personnel_id = p.id
      GROUP BY a.id, c.id
      ORDER BY a.created_at DESC
      LIMIT $1
    `, [limit]);
    
    return result.rows.map(row => ({
      ...row,
      companies: {
        id: row.company_id,
        name: row.company_name,
        tax_no: row.tax_no,
        contact_name: row.contact_name,
        address: row.address,
        phone: row.phone,
        email: row.email
      }
    }));
  }

  async findAll() {
    const result = await pool.query(`
      SELECT 
        a.*,
        c.name as company_name, c.tax_no, c.contact_name, c.address, c.phone, c.email,
        COALESCE(
          json_agg(
            json_build_object(
              'id', t.id,
              'experiment_type_id', t.experiment_type_id,
              'responsible_personnel_id', t.responsible_personnel_id,
              'unit_price', t.unit_price,
              'sample_count', t.sample_count,
              'total_price', t.total_price,
              'is_accredited', t.is_accredited,
              'uygunluk', t.uygunluk,
              'created_at', t.created_at,
              'experiment_type_name', et.name,
              'experiment_type_base_price', et.base_price,
              'personnel_first_name', p.first_name,
              'personnel_last_name', p.last_name,
              'personnel_title', p.title
            )
          ) FILTER (WHERE t.id IS NOT NULL), '[]'::json
        ) as tests
      FROM applications a
      LEFT JOIN companies c ON a.company_id = c.id
      LEFT JOIN tests t ON a.id = t.application_id
      LEFT JOIN experiment_types et ON t.experiment_type_id = et.id
      LEFT JOIN personnel p ON t.responsible_personnel_id = p.id
      GROUP BY a.id, c.id
      ORDER BY a.created_at DESC
    `);
    
    return result.rows.map(row => ({
      ...row,
      companies: {
        id: row.company_id,
        name: row.company_name,
        tax_no: row.tax_no,
        contact_name: row.contact_name,
        address: row.address,
        phone: row.phone,
        email: row.email
      }
    }));
  }

  async create(data: ApplicationData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Create application
      const appResult = await client.query(
        `INSERT INTO applications (company_id, application_no, application_date, certification_type, test_count, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *`,
        [data.company_id, data.application_no, new Date(data.application_date), data.certification_type, data.tests.length]
      );
      
      const newApp = appResult.rows[0];
      
      // Create tests with server-calculated prices
      const createdTests = [];
      for (const test of data.tests) {
        const testResult = await client.query(
          `INSERT INTO tests (application_id, experiment_type_id, responsible_personnel_id, unit_price, sample_count, is_accredited, uygunluk, created_at)
           SELECT $1, $2, $3, et.base_price + (CASE WHEN $4 THEN 750 ELSE 0 END), $6, $5, $4, NOW()
           FROM experiment_types et WHERE et.id = $2
           RETURNING *`,
          [newApp.id, test.experiment_type_id, test.responsible_personnel_id, test.uygunluk, test.is_accredited, test.sample_count || 1]
        );
        createdTests.push(testResult.rows[0]);
      }
      
      await client.query('COMMIT');
      
      return {
        ...newApp,
        tests: createdTests
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id: number, data: ApplicationData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Update application
      const appResult = await client.query(
        `UPDATE applications 
         SET company_id = $1, application_no = $2, application_date = $3, certification_type = $4, test_count = $5
         WHERE id = $6
         RETURNING *`,
        [data.company_id, data.application_no, new Date(data.application_date), data.certification_type, data.tests.length, id]
      );
      
      if (appResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }
      
      // Delete old tests
      await client.query('DELETE FROM tests WHERE application_id = $1', [id]);
      
      // Create new tests with server-calculated prices
      const createdTests = [];
      for (const test of data.tests) {
        const testResult = await client.query(
          `INSERT INTO tests (application_id, experiment_type_id, responsible_personnel_id, unit_price, sample_count, is_accredited, uygunluk, created_at)
           SELECT $1, $2, $3, et.base_price + (CASE WHEN $4 THEN 750 ELSE 0 END), $6, $5, $4, NOW()
           FROM experiment_types et WHERE et.id = $2
           RETURNING *`,
          [id, test.experiment_type_id, test.responsible_personnel_id, test.uygunluk, test.is_accredited, test.sample_count || 1]
        );
        createdTests.push(testResult.rows[0]);
      }
      
      await client.query('COMMIT');
      
      return {
        ...appResult.rows[0],
        tests: createdTests
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id: number) {
    const result = await pool.query('DELETE FROM applications WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }
}
