import { Pool } from 'pg';

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
  constructor(private db: Pool) {}

  async findAll(): Promise<MaintenanceOrg[]> {
    const query = `
      SELECT * FROM maintenance_orgs
      ORDER BY org_name ASC
    `;
    const result = await this.db.query(query);
    return result.rows;
  }

  async findById(id: number): Promise<MaintenanceOrg | null> {
    const query = 'SELECT * FROM maintenance_orgs WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
    }

  async create(orgData: MaintenanceOrgInput): Promise<MaintenanceOrg> {
    const query = `
      INSERT INTO maintenance_orgs (org_name, contact_name, phone, email)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [
      orgData.org_name,
      orgData.contact_name || null,
      orgData.phone || null,
      orgData.email || null
    ];
    const result = await this.db.query(query, values);
    return result.rows[0];
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
    const query = `
      UPDATE maintenance_orgs
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM maintenance_orgs WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async search(searchTerm: string): Promise<MaintenanceOrg[]> {
    const query = `
      SELECT * FROM maintenance_orgs
      WHERE org_name ILIKE $1
         OR contact_name ILIKE $1
         OR phone ILIKE $1
         OR email ILIKE $1
      ORDER BY org_name ASC
    `;
    const result = await this.db.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }
}