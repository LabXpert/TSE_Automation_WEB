import { Pool } from 'pg';

export interface Machine {
  id: number;
  serial_no: string;
  equipment_name: string;
  brand?: string;
  model?: string;
  measurement_range?: string;
  last_calibration_date: Date;
  calibration_org_id: number;
  created_at?: Date;
  
  // Join fields
  calibration_org?: {
    id: number;
    org_name: string;
    contact_name?: string;
    email?: string;
    phone?: string;
  };
}

export interface MachineInput {
  serial_no: string;
  equipment_name: string;
  brand?: string;
  model?: string;
  measurement_range?: string;
  last_calibration_date: Date;
  calibration_org_id: number;
}

export class MachineRepository {
  constructor(private db: Pool) {}

  async findAll(): Promise<Machine[]> {
    const query = `
      SELECT 
        m.*,
        co.org_name as calibration_org_name,
        co.contact_name as calibration_org_contact,
        co.email as calibration_org_email,
        co.phone as calibration_org_phone
      FROM machines m
      LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
      ORDER BY m.equipment_name ASC
    `;
    const result = await this.db.query(query);
    
    return result.rows.map(row => ({
      id: row.id,
      serial_no: row.serial_no,
      equipment_name: row.equipment_name,
      brand: row.brand,
      model: row.model,
      measurement_range: row.measurement_range,
      last_calibration_date: row.last_calibration_date,
      calibration_org_id: row.calibration_org_id,
      created_at: row.created_at,
      calibration_org: row.calibration_org_name ? {
        id: row.calibration_org_id,
        org_name: row.calibration_org_name,
        contact_name: row.calibration_org_contact,
        email: row.calibration_org_email,
        phone: row.calibration_org_phone
      } : undefined
    }));
  }

  async findById(id: number): Promise<Machine | null> {
    const query = `
      SELECT 
        m.*,
        co.org_name as calibration_org_name,
        co.contact_name as calibration_org_contact,
        co.email as calibration_org_email,
        co.phone as calibration_org_phone
      FROM machines m
      LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
      WHERE m.id = $1
    `;
    const result = await this.db.query(query, [id]);
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      id: row.id,
      serial_no: row.serial_no,
      equipment_name: row.equipment_name,
      brand: row.brand,
      model: row.model,
      measurement_range: row.measurement_range,
      last_calibration_date: row.last_calibration_date,
      calibration_org_id: row.calibration_org_id,
      created_at: row.created_at,
      calibration_org: row.calibration_org_name ? {
        id: row.calibration_org_id,
        org_name: row.calibration_org_name,
        contact_name: row.calibration_org_contact,
        email: row.calibration_org_email,
        phone: row.calibration_org_phone
      } : undefined
    };
  }

  async create(machineData: MachineInput): Promise<Machine> {
    const query = `
      INSERT INTO machines (
        serial_no, equipment_name, brand, model, 
        measurement_range, last_calibration_date, calibration_org_id
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `;
    const values = [
      machineData.serial_no,
      machineData.equipment_name,
      machineData.brand || null,
      machineData.model || null,
      machineData.measurement_range || null,
      machineData.last_calibration_date,
      machineData.calibration_org_id
    ];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async update(id: number, machineData: Partial<MachineInput>): Promise<Machine | null> {
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (machineData.serial_no !== undefined) {
      updateFields.push(`serial_no = $${paramCount++}`);
      values.push(machineData.serial_no);
    }
    if (machineData.equipment_name !== undefined) {
      updateFields.push(`equipment_name = $${paramCount++}`);
      values.push(machineData.equipment_name);
    }
    if (machineData.brand !== undefined) {
      updateFields.push(`brand = $${paramCount++}`);
      values.push(machineData.brand);
    }
    if (machineData.model !== undefined) {
      updateFields.push(`model = $${paramCount++}`);
      values.push(machineData.model);
    }
    if (machineData.measurement_range !== undefined) {
      updateFields.push(`measurement_range = $${paramCount++}`);
      values.push(machineData.measurement_range);
    }
    if (machineData.last_calibration_date !== undefined) {
      updateFields.push(`last_calibration_date = $${paramCount++}`);
      values.push(machineData.last_calibration_date);
    }
    if (machineData.calibration_org_id !== undefined) {
      updateFields.push(`calibration_org_id = $${paramCount++}`);
      values.push(machineData.calibration_org_id);
    }

    if (updateFields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE machines 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM machines WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async search(searchTerm: string): Promise<Machine[]> {
    const query = `
      SELECT 
        m.*,
        co.org_name as calibration_org_name,
        co.contact_name as calibration_org_contact,
        co.email as calibration_org_email,
        co.phone as calibration_org_phone
      FROM machines m
      LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
      WHERE m.serial_no ILIKE $1 
         OR m.equipment_name ILIKE $1 
         OR m.brand ILIKE $1
         OR m.model ILIKE $1
         OR co.org_name ILIKE $1
      ORDER BY m.equipment_name ASC
    `;
    const result = await this.db.query(query, [`%${searchTerm}%`]);
    
    return result.rows.map(row => ({
      id: row.id,
      serial_no: row.serial_no,
      equipment_name: row.equipment_name,
      brand: row.brand,
      model: row.model,
      measurement_range: row.measurement_range,
      last_calibration_date: row.last_calibration_date,
      calibration_org_id: row.calibration_org_id,
      created_at: row.created_at,
      calibration_org: row.calibration_org_name ? {
        id: row.calibration_org_id,
        org_name: row.calibration_org_name,
        contact_name: row.calibration_org_contact,
        email: row.calibration_org_email,
        phone: row.calibration_org_phone
      } : undefined
    }));
  }

  async findByCalibrationOrg(orgId: number): Promise<Machine[]> {
    const query = `
      SELECT 
        m.*,
        co.org_name as calibration_org_name,
        co.contact_name as calibration_org_contact,
        co.email as calibration_org_email,
        co.phone as calibration_org_phone
      FROM machines m
      LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
      WHERE m.calibration_org_id = $1
      ORDER BY m.equipment_name ASC
    `;
    const result = await this.db.query(query, [orgId]);
    
    return result.rows.map(row => ({
      id: row.id,
      serial_no: row.serial_no,
      equipment_name: row.equipment_name,
      brand: row.brand,
      model: row.model,
      measurement_range: row.measurement_range,
      last_calibration_date: row.last_calibration_date,
      calibration_org_id: row.calibration_org_id,
      created_at: row.created_at,
      calibration_org: row.calibration_org_name ? {
        id: row.calibration_org_id,
        org_name: row.calibration_org_name,
        contact_name: row.calibration_org_contact,
        email: row.calibration_org_email,
        phone: row.calibration_org_phone
      } : undefined
    }));
  }

  async findExpiringCalibrations(days: number = 30): Promise<Machine[]> {
    const query = `
      SELECT 
        m.*,
        co.org_name as calibration_org_name,
        co.contact_name as calibration_org_contact,
        co.email as calibration_org_email,
        co.phone as calibration_org_phone
      FROM machines m
      LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
      WHERE m.last_calibration_date + INTERVAL '1 year' <= CURRENT_DATE + INTERVAL '${days} days'
      ORDER BY m.last_calibration_date ASC
    `;
    const result = await this.db.query(query);
    
    return result.rows.map(row => ({
      id: row.id,
      serial_no: row.serial_no,
      equipment_name: row.equipment_name,
      brand: row.brand,
      model: row.model,
      measurement_range: row.measurement_range,
      last_calibration_date: row.last_calibration_date,
      calibration_org_id: row.calibration_org_id,
      created_at: row.created_at,
      calibration_org: row.calibration_org_name ? {
        id: row.calibration_org_id,
        org_name: row.calibration_org_name,
        contact_name: row.calibration_org_contact,
        email: row.calibration_org_email,
        phone: row.calibration_org_phone
      } : undefined
    }));
  }
}
