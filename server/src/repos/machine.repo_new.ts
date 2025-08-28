import { query, isSQLite } from '../db';

export interface Machine {
  id: number;
  serial_no: string;
  equipment_name: string;
  brand?: string;
  model?: string;
  measurement_range?: string;
  last_calibration_date: string;
  calibration_org_id: number;
  calibration_org_name?: string;
  created_at: string;
}

export interface MachineInput {
  serial_no: string;
  equipment_name: string;
  brand?: string;
  model?: string;
  measurement_range?: string;
  last_calibration_date: string;
  calibration_org_id: number;
}

export class MachineRepository {

  // Tüm makineleri getir (kalibrasyon kuruluş adı ile birlikte)
  async findAll(): Promise<Machine[]> {
    const sql = `
      SELECT
        m.id,
        m.serial_no,
        m.equipment_name,
        m.brand,
        m.model,
        m.measurement_range,
        m.last_calibration_date,
        m.calibration_org_id,
        co.org_name as calibration_org_name,
        m.created_at
      FROM machines m
      LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
      ORDER BY m.created_at DESC
    `;
    
    const result = await query(sql);
    return result.rows;
  }

  // ID ile makine getir
  async findById(id: number): Promise<Machine | null> {
    const sql = `
      SELECT
        m.id,
        m.serial_no,
        m.equipment_name,
        m.brand,
        m.model,
        m.measurement_range,
        m.last_calibration_date,
        m.calibration_org_id,
        co.org_name as calibration_org_name,
        m.created_at
      FROM machines m
      LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
      WHERE m.id = $1
    `;
    
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  // Yeni makine oluştur
  async create(machineData: MachineInput): Promise<Machine> {
    const baseSql = `
      INSERT INTO machines (
        serial_no,
        equipment_name,
        brand,
        model,
        measurement_range,
        last_calibration_date,
        calibration_org_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    
    const values = [
      machineData.serial_no,
      machineData.equipment_name,
      machineData.brand || null,
      machineData.model || null,
      machineData.measurement_range || null,
      machineData.last_calibration_date,
      machineData.calibration_org_id,
    ];
    if (isSQLite) {
      const result = await query(baseSql, values);
      return (await this.findById(result.lastID!)) as Machine;
    } else {
      const result = await query(baseSql + ' RETURNING id', values);
      return (await this.findById(result.rows[0].id)) as Machine;
    }
  }

  // Makine güncelle
  async update(id: number, machineData: Partial<MachineInput>): Promise<Machine | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (machineData.serial_no !== undefined) {
      fields.push(`serial_no = $${paramIndex++}`);
      values.push(machineData.serial_no);
    }
    if (machineData.equipment_name !== undefined) {
      fields.push(`equipment_name = $${paramIndex++}`);
      values.push(machineData.equipment_name);
    }
    if (machineData.brand !== undefined) {
      fields.push(`brand = $${paramIndex++}`);
      values.push(machineData.brand);
    }
    if (machineData.model !== undefined) {
      fields.push(`model = $${paramIndex++}`);
      values.push(machineData.model);
    }
    if (machineData.measurement_range !== undefined) {
      fields.push(`measurement_range = $${paramIndex++}`);
      values.push(machineData.measurement_range);
    }
    if (machineData.last_calibration_date !== undefined) {
      fields.push(`last_calibration_date = $${paramIndex++}`);
      values.push(machineData.last_calibration_date);
    }
    if (machineData.calibration_org_id !== undefined) {
      fields.push(`calibration_org_id = $${paramIndex++}`);
      values.push(machineData.calibration_org_id);
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const baseSql = `
      UPDATE machines
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
    `;
    if (isSQLite) {
      await query(baseSql, values);
      return await this.findById(id);
    } else {
      const result = await query(baseSql + ' RETURNING id', values);
      if (result.rows.length === 0) {
        return null;
      }
      return await this.findById(id);
  }

  }

  // Makine sil
  async delete(id: number): Promise<boolean> {
    if (isSQLite) {
      const result = await query('DELETE FROM machines WHERE id = $1', [id]);
      return (result.changes || 0) > 0;
    } else {
      const result = await query('DELETE FROM machines WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    }
  }

  // Makine ara
  async search(searchTerm: string): Promise<Machine[]> {
    const sql = `
      SELECT
        m.id,
        m.serial_no,
        m.equipment_name,
        m.brand,
        m.model,
        m.measurement_range,
        m.last_calibration_date,
        m.calibration_org_id,
        co.org_name as calibration_org_name,
        m.created_at
      FROM machines m
      LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
      WHERE
        LOWER(m.equipment_name) LIKE LOWER($1) OR
        LOWER(m.brand) LIKE LOWER($1) OR
        LOWER(m.model) LIKE LOWER($1) OR
        LOWER(m.serial_no) LIKE LOWER($1) OR
        LOWER(co.org_name) LIKE LOWER($1)
      ORDER BY m.created_at DESC
    `;
    const searchPattern = `%${searchTerm}%`;
    const result = await query(sql, [searchPattern]);
    return result.rows;
  }
}

