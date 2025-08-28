import { query, isSQLite } from '../db';

export interface CalibrationOrg {
  id: number;
  org_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  created_at?: Date;
}

export interface CalibrationOrgInput {
  org_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
}

export class CalibrationOrgRepository {

  async findAll(): Promise<CalibrationOrg[]> {
    const result = await query('SELECT * FROM calibration_orgs ORDER BY org_name ASC');
    return result.rows;
  }

  async findById(id: number): Promise<CalibrationOrg | null> {
    const result = await query('SELECT * FROM calibration_orgs WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(orgData: CalibrationOrgInput): Promise<CalibrationOrg> {
    const baseSql = `
      INSERT INTO calibration_orgs (org_name, contact_name, email, phone)
      VALUES ($1, $2, $3, $4)
    `;
    const values = [
      orgData.org_name,
      orgData.contact_name || null,
      orgData.email || null,
      orgData.phone || null,
    ];
    if (isSQLite) {
      const result = await query(baseSql, values);
      const row = await query('SELECT * FROM calibration_orgs WHERE id = $1', [result.lastID]);
      return row.rows[0];
    } else {
      const result = await query(baseSql + ' RETURNING *', values);
      return result.rows[0];
    }
  }

  async update(id: number, orgData: Partial<CalibrationOrgInput>): Promise<CalibrationOrg | null> {
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (orgData.org_name !== undefined) {
      updateFields.push(`org_name = $${paramCount++}`);
      values.push(orgData.org_name);
    }
    if (orgData.contact_name !== undefined) {
      updateFields.push(`contact_name = $${paramCount++}`);
      values.push(orgData.contact_name);
    }
    if (orgData.email !== undefined) {
      updateFields.push(`email = $${paramCount++}`);
      values.push(orgData.email);
    }
    if (orgData.phone !== undefined) {
      updateFields.push(`phone = $${paramCount++}`);
      values.push(orgData.phone);
    }

    if (updateFields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const baseSql = `
      UPDATE calibration_orgs
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
    `;

    if (isSQLite) {
      await query(baseSql, values);
      const row = await query('SELECT * FROM calibration_orgs WHERE id = $1', [id]);
      return row.rows[0] || null;
    } else {
      const result = await query(baseSql + ' RETURNING *', values);
      return result.rows[0] || null;
    }
  }

  async delete(id: number): Promise<boolean> {
    if (isSQLite) {
      const result = await query('DELETE FROM calibration_orgs WHERE id = $1', [id]);
      return (result.changes || 0) > 0;
    } else {
      const result = await query('DELETE FROM calibration_orgs WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    }
  }

  async search(searchTerm: string): Promise<CalibrationOrg[]> {
    const sql = `
      SELECT * FROM calibration_orgs
      WHERE LOWER(org_name) LIKE LOWER($1)
         OR LOWER(contact_name) LIKE LOWER($1)
         OR LOWER(email) LIKE LOWER($1)
      ORDER BY org_name ASC
    `;
    const result = await query(sql, [`%${searchTerm}%`]);
    return result.rows;
  }
}
