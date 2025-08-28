import { query, isSQLite } from '../db';

export interface MaintenanceOrg {
  id: number;
  org_name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  created_at?: Date;
}

export interface MaintenanceOrgInput {
  org_name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
}

export class MaintenanceOrgRepository {

  async findAll(): Promise<MaintenanceOrg[]> {
    const result = await query('SELECT * FROM maintenance_orgs ORDER BY org_name ASC');
    return result.rows;
  }

  async findById(id: number): Promise<MaintenanceOrg | null> {
    const result = await query('SELECT * FROM maintenance_orgs WHERE id = $1', [id]);
    return result.rows[0] || null;
    }

  async create(orgData: MaintenanceOrgInput): Promise<MaintenanceOrg> {
    const baseSql = `
      INSERT INTO maintenance_orgs (org_name, contact_name, phone, email)
      VALUES ($1, $2, $3, $4)
    `;
    const values = [
      orgData.org_name,
      orgData.contact_name || null,
      orgData.phone || null,
      orgData.email || null,
    ];
    if (isSQLite) {
      const result = await query(baseSql, values);
      const row = await query('SELECT * FROM maintenance_orgs WHERE id = $1', [result.lastID]);
      return row.rows[0];
    } else {
      const result = await query(baseSql + ' RETURNING *', values);
      return result.rows[0];
    }
  }

  async update(id: number, orgData: Partial<MaintenanceOrgInput>): Promise<MaintenanceOrg | null> {
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
    if (orgData.phone !== undefined) {
      updateFields.push(`phone = $${paramCount++}`);
      values.push(orgData.phone);
    }
    if (orgData.email !== undefined) {
      updateFields.push(`email = $${paramCount++}`);
      values.push(orgData.email);
    }

    if (updateFields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const baseSql = `
      UPDATE maintenance_orgs
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
    `;
    if (isSQLite) {
      await query(baseSql, values);
      const row = await query('SELECT * FROM maintenance_orgs WHERE id = $1', [id]);
      return row.rows[0] || null;
    } else {
      const result = await query(baseSql + ' RETURNING *', values);
      return result.rows[0] || null;
    }
  }

  async delete(id: number): Promise<boolean> {
    if (isSQLite) {
      const result = await query('DELETE FROM maintenance_orgs WHERE id = $1', [id]);
      return (result.changes || 0) > 0;
    } else {
      const result = await query('DELETE FROM maintenance_orgs WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    }
  }

  async search(searchTerm: string): Promise<MaintenanceOrg[]> {
    const sql = `
      SELECT * FROM maintenance_orgs
      WHERE LOWER(org_name) LIKE LOWER($1)
         OR LOWER(contact_name) LIKE LOWER($1)
         OR LOWER(phone) LIKE LOWER($1)
         OR LOWER(email) LIKE LOWER($1)
      ORDER BY org_name ASC
    `;
    const result = await query(sql, [`%${searchTerm}%`]);
    return result.rows;
  }
}