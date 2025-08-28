import { query, isSQLite } from '../db';

export interface CompanyData {
  name: string;
  tax_no: string;
  contact_name: string;
  address: string;
  phone: string;
  email: string;
}

export class CompanyRepository {
  async findAll() {
    const result = await query('SELECT * FROM companies ORDER BY id ASC');
    return result.rows;
  }

  async findById(id: number) {
    const result = await query('SELECT * FROM companies ORDER BY id ASC');
    return result.rows[0] || null;
  }

  async create(data: CompanyData) {
    const baseSql = `INSERT INTO companies (name, tax_no, contact_name, address, phone, email, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`;
    if (isSQLite) {
      const result = await query(baseSql, [data.name, data.tax_no, data.contact_name, data.address, data.phone, data.email]);
      const row = await query('SELECT * FROM companies WHERE id = $1', [result.lastID]);
      return row.rows[0];
    } else {
      const result = await query(baseSql + ' RETURNING *', [data.name, data.tax_no, data.contact_name, data.address, data.phone, data.email]);
      return result.rows[0];
    }
  }

  async update(id: number, data: CompanyData) {
    const baseSql = `UPDATE companies
       SET name = $1, tax_no = $2, contact_name = $3, address = $4, phone = $5, email = $6
       WHERE id = $7`;
    if (isSQLite) {
      await query(baseSql, [data.name, data.tax_no, data.contact_name, data.address, data.phone, data.email, id]);
      const row = await query('SELECT * FROM companies WHERE id = $1', [id]);
      return row.rows[0] || null;
    } else {
      const result = await query(baseSql + ' RETURNING *', [data.name, data.tax_no, data.contact_name, data.address, data.phone, data.email, id]);
      return result.rows[0] || null;
    }
  }

  async delete(id: number) {
    if (isSQLite) {
      const result = await query('DELETE FROM companies WHERE id = $1', [id]);
      return (result.changes || 0) > 0;
    } else {
      const result = await query('DELETE FROM companies WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    }
  }
}
