import { query, getClient, isSQLite } from '../db';

// Augment TestData with optional sample_count via interface merging
export interface TestData {
  sample_count?: number;
}

async function computeUnitPrice(experimentTypeId: number, uygunluk: boolean): Promise<number> {
  const res = await query('SELECT base_price FROM experiment_types WHERE id = $1', [experimentTypeId]);
  const base = res.rows?.[0]?.base_price != null ? Number(res.rows[0].base_price) : 0;
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
  unit_price?: number;
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
    const apps = await query(
      `SELECT a.*, c.name AS company_name, c.tax_no, c.contact_name, c.address, c.phone, c.email
         FROM applications a
         LEFT JOIN companies c ON a.company_id = c.id
         ORDER BY a.created_at DESC
         LIMIT $1`,
      [limit],
    );
    return Promise.all(
      apps.rows.map(async (row) => {
        const tests = await query(
          `SELECT t.*, et.name AS experiment_type_name, et.base_price AS experiment_type_base_price,
                  p.first_name AS personnel_first_name, p.last_name AS personnel_last_name, p.title AS personnel_title
             FROM tests t
             LEFT JOIN experiment_types et ON t.experiment_type_id = et.id
             LEFT JOIN personnel p ON t.responsible_personnel_id = p.id
            WHERE t.application_id = $1`,
          [row.id],
        );
        return {
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
          tests: tests.rows,
        };
      }),
    );
  }

  async findAll() {
    const apps = await query(
      `SELECT a.*, c.name AS company_name, c.tax_no, c.contact_name, c.address, c.phone, c.email
         FROM applications a
         LEFT JOIN companies c ON a.company_id = c.id
         ORDER BY a.created_at DESC`,
    );
    return Promise.all(
      apps.rows.map(async (row) => {
        const tests = await query(
          `SELECT t.*, et.name AS experiment_type_name, et.base_price AS experiment_type_base_price,
                  p.first_name AS personnel_first_name, p.last_name AS personnel_last_name, p.title AS personnel_title
             FROM tests t
             LEFT JOIN experiment_types et ON t.experiment_type_id = et.id
             LEFT JOIN personnel p ON t.responsible_personnel_id = p.id
            WHERE t.application_id = $1`,
          [row.id],
        );
        return {
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
          tests: tests.rows,
        };
      }),
    );
  }

  async findLast7Days() {
    const dateCondition = isSQLite
      ? "a.application_date >= DATE('now','-7 day')"
      : "a.application_date >= CURRENT_DATE - INTERVAL '7 days'";
    const apps = await query(
      `SELECT a.*, c.name AS company_name, c.tax_no, c.contact_name, c.address, c.phone, c.email
         FROM applications a
         LEFT JOIN companies c ON a.company_id = c.id
        WHERE ${dateCondition}
         ORDER BY a.created_at DESC`,
    );
    return Promise.all(
      apps.rows.map(async (row) => {
        const tests = await query(
          `SELECT t.*, et.name AS experiment_type_name, et.base_price AS experiment_type_base_price,
                  p.first_name AS personnel_first_name, p.last_name AS personnel_last_name, p.title AS personnel_title
             FROM tests t
             LEFT JOIN experiment_types et ON t.experiment_type_id = et.id
             LEFT JOIN personnel p ON t.responsible_personnel_id = p.id
            WHERE t.application_id = $1`,
          [row.id],
        );
        return {
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
          tests: tests.rows,
        };
      }),
    );
  }

  async create(data: ApplicationData) {
    const client = await getClient();
    try {
      await client.begin();
      const baseSql = `INSERT INTO applications (company_id, application_no, application_date, certification_type, test_count, created_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`;
      let newApp: any;
      if (isSQLite) {
        const res = await client.query(baseSql, [data.company_id, data.application_no, new Date(data.application_date), data.certification_type, data.tests.length]);
        const row = await client.query('SELECT * FROM applications WHERE id = $1', [res.lastID]);
        newApp = row.rows[0];
      } else {
        const res = await client.query(baseSql + ' RETURNING *', [data.company_id, data.application_no, new Date(data.application_date), data.certification_type, data.tests.length]);
        newApp = res.rows[0];
      }
      const createdTests: any[] = [];
      for (const test of data.tests) {
        const unitPrice = await computeUnitPrice(test.experiment_type_id, test.uygunluk);
                const baseTestSql = `INSERT INTO tests (application_id, experiment_type_id, responsible_personnel_id, unit_price, sample_count, is_accredited, uygunluk, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`;
        if (isSQLite) {
          const r = await client.query(baseTestSql, [newApp.id, test.experiment_type_id, test.responsible_personnel_id, unitPrice, test.sample_count ?? 1, test.is_accredited, test.uygunluk]);
          const row = await client.query('SELECT * FROM tests WHERE id = $1', [r.lastID]);
          createdTests.push(row.rows[0]);
        } else {
          const r = await client.query(baseTestSql + ' RETURNING *', [newApp.id, test.experiment_type_id, test.responsible_personnel_id, unitPrice, test.sample_count ?? 1, test.is_accredited, test.uygunluk]);
          createdTests.push(r.rows[0]);
        }
      }

      await client.commit();
      return { ...newApp, tests: createdTests };
    } catch (err) {
      await client.rollback();
      throw err;
    } finally {
      client.release();
    }
  }

  async update(id: number, data: ApplicationData) {
    const client = await getClient();
    try {
      await client.begin();
      const baseSql = `UPDATE applications 
           SET company_id = $1, application_no = $2, application_date = $3, certification_type = $4, test_count = $5
         WHERE id = $6`;
      let updated: any;
      if (isSQLite) {
        await client.query(baseSql, [data.company_id, data.application_no, new Date(data.application_date), data.certification_type, data.tests.length, id]);
        const row = await client.query('SELECT * FROM applications WHERE id = $1', [id]);
        updated = row.rows[0];
      } else {
        const res = await client.query(baseSql + ' RETURNING *', [data.company_id, data.application_no, new Date(data.application_date), data.certification_type, data.tests.length, id]);
        if (res.rows.length === 0) {
          await client.rollback();
          return null;
        }
        updated = res.rows[0];
      }

      await client.query('DELETE FROM tests WHERE application_id = $1', [id]);

      const createdTests: any[] = [];
      for (const test of data.tests) {
        const unitPrice = await computeUnitPrice(test.experiment_type_id, test.uygunluk);
        const baseTestSql = `INSERT INTO tests (application_id, experiment_type_id, responsible_personnel_id, unit_price, sample_count, is_accredited, uygunluk, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`;
        if (isSQLite) {
          const r = await client.query(baseTestSql, [id, test.experiment_type_id, test.responsible_personnel_id, unitPrice, test.sample_count ?? 1, test.is_accredited, test.uygunluk]);
          const row = await client.query('SELECT * FROM tests WHERE id = $1', [r.lastID]);
          createdTests.push(row.rows[0]);
        } else {
          const r = await client.query(baseTestSql + ' RETURNING *', [id, test.experiment_type_id, test.responsible_personnel_id, unitPrice, test.sample_count ?? 1, test.is_accredited, test.uygunluk]);
          createdTests.push(r.rows[0]);
        }
      }

      await client.commit();
      return { ...updated, tests: createdTests };
    } catch (err) {
      await client.rollback();
      throw err;
    } finally {
      client.release();
    }
  }

  async getPriceSummary(id: number): Promise<PriceSummary | null> {
    const app = await query('SELECT id FROM applications WHERE id = $1', [id]);
    if (app.rows.length === 0) return null;
    const tests = await query('SELECT id, experiment_type_id, uygunluk, unit_price FROM tests WHERE application_id = $1', [id]);
    const items = tests.rows.map((t) => ({
      test_id: t.id,
      experiment_type_id: t.experiment_type_id,
      uygunluk: !!t.uygunluk,
      unit_price: Number(t.unit_price) || 0,
    }));
    const total = items.reduce((sum, t) => sum + t.unit_price, 0);
    return {
      application_id: id,
      currency: 'TRY',
       total_with_vat: total,
      test_count: items.length,
      items,
    };
  }

  async delete(id: number) {
    if (isSQLite) {
      const res = await query('DELETE FROM applications WHERE id = $1', [id]);
      return (res.changes || 0) > 0;
    } else {
      const res = await query('DELETE FROM applications WHERE id = $1 RETURNING id', [id]);
      return res.rows.length > 0;
    }
  }
}
