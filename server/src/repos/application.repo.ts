import pool from '../database/connection';

// Augment TestData with optional sample_count via interface merging
export interface TestData {
  sample_count?: number;
}

// Compute unit price based on experiment type base price
async function computeUnitPrice(experimentTypeId: number, uygunluk: boolean): Promise<number> {
  const res = await pool.query('SELECT base_price FROM experiment_types WHERE id = $1', [experimentTypeId]);
  const base = res.rows?.[0]?.base_price != null ? Number(res.rows[0].base_price) : 0;
  // Future hook: adjust by uygunluk if needed
  return Number.isFinite(base) ? base : 0;
}

export interface ApplicationData {
  company_id: number;
  application_no: string;
  application_date: string; // YYYY-MM-DD
  certification_type: string;
  tests: TestData[];
}

export interface TestData {
  experiment_type_id: number;
  responsible_personnel_id: number;
  is_accredited: boolean;
  uygunluk: boolean;
  unit_price?: number; // ignored on server; computed
  sample_count?: number;
}

export interface TestPriceItem {
  test_id: number;
  experiment_type_id: number;
  uygunluk: boolean;
  unit_price: number;
}

export interface PriceSummary {
  application_id: number;
  currency: 'TRY';
  total_with_vat: number;
  test_count: number;
  items: TestPriceItem[];
}

export class ApplicationRepository {
  async findRecent(limit: number = 5) {
    const result = await pool.query(
      `SELECT 
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
       LIMIT $1`,
      [limit]
    );

    return result.rows.map((row) => ({
      ...row,
      companies: {
        id: row.company_id,
        name: row.company_name,
        tax_no: row.tax_no,
        contact_name: row.contact_name,
        address: row.address,
        phone: row.phone,
        email: row.email,
      },
    }));
  }

  async findAll() {
    const result = await pool.query(
      `SELECT 
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
       ORDER BY a.created_at DESC`
    );

    return result.rows.map((row) => ({
      ...row,
      companies: {
        id: row.company_id,
        name: row.company_name,
        tax_no: row.tax_no,
        contact_name: row.contact_name,
        address: row.address,
        phone: row.phone,
        email: row.email,
      },
    }));
  }

  async findLast7Days() {
    const result = await pool.query(
      `SELECT 
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
       WHERE a.application_date >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY a.id, c.id
       ORDER BY a.created_at DESC`
    );

    return result.rows.map((row) => ({
      ...row,
      companies: {
        id: row.company_id,
        name: row.company_name,
        tax_no: row.tax_no,
        contact_name: row.contact_name,
        address: row.address,
        phone: row.phone,
        email: row.email,
      },
    }));
  }

  async create(data: ApplicationData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const appResult = await client.query(
        `INSERT INTO applications (company_id, application_no, application_date, certification_type, test_count, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *`,
        [data.company_id, data.application_no, new Date(data.application_date), data.certification_type, data.tests.length]
      );

      const newApp = appResult.rows[0];

      const createdTests: unknown[] = [];
      for (const test of data.tests) {
        const unitPrice = await computeUnitPrice(test.experiment_type_id, test.uygunluk);
        const testResult = await client.query(
          `INSERT INTO tests (application_id, experiment_type_id, responsible_personnel_id, unit_price, sample_count, is_accredited, uygunluk, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
           RETURNING *`,
          [
            newApp.id,
            test.experiment_type_id,
            test.responsible_personnel_id,
            unitPrice,
            test.sample_count ?? 1,
            test.is_accredited,
            test.uygunluk,
          ]
        );
        createdTests.push(testResult.rows[0] as unknown);
      }

      await client.query('COMMIT');

      return {
        ...newApp,
        tests: createdTests,
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

      await client.query('DELETE FROM tests WHERE application_id = $1', [id]);

      const createdTests: unknown[] = [];
      for (const test of data.tests) {
        const unitPrice = await computeUnitPrice(test.experiment_type_id, test.uygunluk);
        const testResult = await client.query(
          `INSERT INTO tests (application_id, experiment_type_id, responsible_personnel_id, unit_price, sample_count, is_accredited, uygunluk, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
           RETURNING *`,
          [
            id,
            test.experiment_type_id,
            test.responsible_personnel_id,
            unitPrice,
            test.sample_count ?? 1,
            test.is_accredited,
            test.uygunluk,
          ]
        );
        createdTests.push(testResult.rows[0] as unknown);
      }

      await client.query('COMMIT');

      return {
        ...appResult.rows[0],
        tests: createdTests,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getPriceSummary(id: number): Promise<PriceSummary | null> {
    const result = await pool.query(
      `SELECT a.id as application_id,
              COALESCE(SUM(t.unit_price), 0) AS total_with_vat,
              COUNT(t.id) AS test_count,
              COALESCE(json_agg(json_build_object(
                'test_id', t.id,
                'experiment_type_id', t.experiment_type_id,
                'uygunluk', t.uygunluk,
                'unit_price', t.unit_price
              )) FILTER (WHERE t.id IS NOT NULL), '[]'::json) AS items
         FROM applications a
         LEFT JOIN tests t ON a.id = t.application_id
        WHERE a.id = $1
        GROUP BY a.id`,
      [id]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      application_id: row.application_id,
      currency: 'TRY',
      total_with_vat: Number(row.total_with_vat) || 0,
      test_count: Number(row.test_count) || 0,
      items: row.items,
    };
  }

  async delete(id: number) {
    const result = await pool.query('DELETE FROM applications WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }
}

