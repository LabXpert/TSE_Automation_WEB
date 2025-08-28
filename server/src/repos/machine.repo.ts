import { query, isSQLite } from '../db';

// Makine tipi (şema ile uyumlu)
export interface Machine {
  id: number;
  serial_no: string;
  equipment_name: string;
  brand?: string;
  model?: string;
  measurement_range?: string;
  last_calibration_date: string;
  calibration_org_id: number;
  calibration_interval: number;
  last_maintenance_date: string;
  maintenance_org_id: number;
  maintenance_interval: number;
  calibration_org_name?: string;
  calibration_contact_name?: string;
  calibration_email?: string;
  calibration_phone?: string;
  maintenance_org_name?: string;
  maintenance_contact_name?: string;
  maintenance_email?: string;
  maintenance_phone?: string;
}

// Makine oluşturma/güncelleme için input tipi
export interface MachineInput {
  serial_no: string;
  equipment_name: string;
  brand?: string;
  model?: string;
  measurement_range?: string;
  last_calibration_date: string;
  calibration_org_id: number;
  calibration_interval: number;
  last_maintenance_date: string;
  maintenance_org_id: number;
  maintenance_interval: number;
}

export class MachineRepository {

  // Tüm makineleri getir (kalibrasyon/bakım kuruluşları ile)
  async findAll(): Promise<Machine[]> {
    try {
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
          m.calibration_interval,
          m.last_maintenance_date,
          m.maintenance_org_id,
          m.maintenance_interval,
          co.org_name   AS calibration_org_name,
          co.contact_name AS calibration_contact_name,
          co.email      AS calibration_email,
          co.phone      AS calibration_phone,
          mo.org_name   AS maintenance_org_name,
          mo.contact_name AS maintenance_contact_name,
          mo.email      AS maintenance_email,
          mo.phone      AS maintenance_phone
        FROM machines m
        LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
        LEFT JOIN maintenance_orgs mo ON m.maintenance_org_id = mo.id
        ORDER BY m.id DESC`;

      const result = await query(sql);
      return result.rows || [];
    } catch (error) {
      console.error('Database query error in findAll:', error);
      return [];
    }
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
        m.calibration_interval,
        m.last_maintenance_date,
        m.maintenance_org_id,
        m.maintenance_interval,
        co.org_name   AS calibration_org_name,
        co.contact_name AS calibration_contact_name,
        co.email      AS calibration_email,
        co.phone      AS calibration_phone,
        mo.org_name   AS maintenance_org_name,
        mo.contact_name AS maintenance_contact_name,
        mo.email      AS maintenance_email,
        mo.phone      AS maintenance_phone
      FROM machines m
      LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
      LEFT JOIN maintenance_orgs mo ON m.maintenance_org_id = mo.id
      WHERE m.id = $1`;
    const result = await query(sql, [id]);
    if (result.rows.length === 0) return null;
    return result.rows[0] as Machine;
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
        calibration_org_id,
        calibration_interval,
        last_maintenance_date,
        maintenance_org_id,
        maintenance_interval
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       `;
    const values = [
      machineData.serial_no,
      machineData.equipment_name,
      machineData.brand ?? null,
      machineData.model ?? null,
      machineData.measurement_range ?? null,
      machineData.last_calibration_date,
      machineData.calibration_org_id,
      machineData.calibration_interval,
      machineData.last_maintenance_date,
      machineData.maintenance_org_id,
      machineData.maintenance_interval,
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
    let idx = 1;
    if (machineData.serial_no !== undefined) { fields.push(`serial_no = $${idx++}`); values.push(machineData.serial_no); }
    if (machineData.equipment_name !== undefined) { fields.push(`equipment_name = $${idx++}`); values.push(machineData.equipment_name); }
    if (machineData.brand !== undefined) { fields.push(`brand = $${idx++}`); values.push(machineData.brand); }
    if (machineData.model !== undefined) { fields.push(`model = $${idx++}`); values.push(machineData.model); }
    if (machineData.measurement_range !== undefined) { fields.push(`measurement_range = $${idx++}`); values.push(machineData.measurement_range); }
    if (machineData.last_calibration_date !== undefined) { fields.push(`last_calibration_date = $${idx++}`); values.push(machineData.last_calibration_date); }
    if (machineData.calibration_org_id !== undefined) { fields.push(`calibration_org_id = $${idx++}`); values.push(machineData.calibration_org_id); }
    if (machineData.calibration_interval !== undefined) { fields.push(`calibration_interval = $${idx++}`); values.push(machineData.calibration_interval); }
    if (machineData.last_maintenance_date !== undefined) { fields.push(`last_maintenance_date = $${idx++}`); values.push(machineData.last_maintenance_date); }
    if (machineData.maintenance_org_id !== undefined) { fields.push(`maintenance_org_id = $${idx++}`); values.push(machineData.maintenance_org_id); }
    if (machineData.maintenance_interval !== undefined) { fields.push(`maintenance_interval = $${idx++}`); values.push(machineData.maintenance_interval); }
    if (fields.length === 0) return await this.findById(id);
    values.push(id);
    const baseSql = `UPDATE machines SET ${fields.join(', ')} WHERE id = $${idx}`;
    if (isSQLite) {
      const result = await query(baseSql, values);
      return (await this.findById(result.lastID!)) as Machine;
    } else {
      const result = await query(baseSql + ' RETURNING id', values);
      return (await this.findById(result.rows[0].id)) as Machine;
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
    const like = `%${searchTerm}%`;
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
        m.calibration_interval,
        m.last_maintenance_date,
        m.maintenance_org_id,
        m.maintenance_interval,
        co.org_name   AS calibration_org_name,
        co.contact_name AS calibration_contact_name,
        co.email      AS calibration_email,
        co.phone      AS calibration_phone,
        mo.org_name   AS maintenance_org_name,
        mo.contact_name AS maintenance_contact_name,
        mo.email      AS maintenance_email,
        mo.phone      AS maintenance_phone
      FROM machines m
      LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
      LEFT JOIN maintenance_orgs mo ON m.maintenance_org_id = mo.id
      WHERE LOWER(m.equipment_name) LIKE LOWER($1)
         OR LOWER(m.serial_no) LIKE LOWER($1)
         OR LOWER(m.brand) LIKE LOWER($1)
         OR LOWER(m.model) LIKE LOWER($1)      ORDER BY m.id DESC`;
    const result = await query(sql, [like]);
    return result.rows as Machine[];
  }

  // Yakında kalibrasyonu dolacak makineler
  async findExpiringCalibrations(days: number): Promise<Machine[]> {
    let sql: string;
    if (isSQLite) {
      sql = `
        SELECT
          m.id,
          m.serial_no,
          m.equipment_name,
          m.brand,
          m.model,
          m.measurement_range,
          m.last_calibration_date,
          m.calibration_org_id,
          m.calibration_interval,
          co.org_name AS calibration_org_name,
          co.contact_name AS calibration_contact_name,
          co.email AS calibration_email,
          co.phone AS calibration_phone
        FROM machines m
        LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
        WHERE DATE(m.last_calibration_date, '+' || m.calibration_interval || ' years') <= DATE('now', '+' || ? || ' days')
        ORDER BY m.last_calibration_date ASC`;
      const result = await query(sql, [String(days)]);
      return result.rows as Machine[];
    } else {
      sql = `
        SELECT
          m.id,
          m.serial_no,
          m.equipment_name,
          m.brand,
          m.model,
          m.measurement_range,
          m.last_calibration_date,
          m.calibration_org_id,
          m.calibration_interval,
          co.org_name AS calibration_org_name,
          co.contact_name AS calibration_contact_name,
          co.email AS calibration_email,
          co.phone AS calibration_phone
        FROM machines m
        LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
        WHERE (m.last_calibration_date + (m.calibration_interval * INTERVAL '1 year')) <= (CURRENT_DATE + ($1 || ' days')::interval)
        ORDER BY m.last_calibration_date ASC`;
      const result = await query(sql, [String(days)]);
      return result.rows as Machine[];
    }
  }

    // Yakında bakımı dolacak makineler
  async findExpiringMaintenances(days: number): Promise<Machine[]> {
        let sql: string;
    if (isSQLite) {
      sql = `
        SELECT
          m.id,
          m.serial_no,
          m.equipment_name,
          m.brand,
          m.model,
          m.measurement_range,
          m.last_maintenance_date,
          m.maintenance_org_id,
          m.maintenance_interval,
          mo.org_name AS maintenance_org_name,
          mo.contact_name AS maintenance_contact_name,
          mo.email AS maintenance_email,
          mo.phone AS maintenance_phone
        FROM machines m
        LEFT JOIN maintenance_orgs mo ON m.maintenance_org_id = mo.id
        WHERE DATE(m.last_maintenance_date, '+' || m.maintenance_interval || ' years') <= DATE('now', '+' || ? || ' days')
        ORDER BY m.last_maintenance_date ASC`;
      const result = await query(sql, [String(days)]);
      return result.rows as Machine[];
    } else {
      sql = `
        SELECT
          m.id,
          m.serial_no,
          m.equipment_name,
          m.brand,
          m.model,
          m.measurement_range,
          m.last_maintenance_date,
          m.maintenance_org_id,
          m.maintenance_interval,
          mo.org_name AS maintenance_org_name,
          mo.contact_name AS maintenance_contact_name,
          mo.email AS maintenance_email,
          mo.phone AS maintenance_phone
        FROM machines m
        LEFT JOIN maintenance_orgs mo ON m.maintenance_org_id = mo.id
        WHERE (m.last_maintenance_date + (m.maintenance_interval * INTERVAL '1 year')) <= (CURRENT_DATE + ($1 || ' days')::interval)
        ORDER BY m.last_maintenance_date ASC`;
      const result = await query(sql, [String(days)]);
      return result.rows as Machine[];
    }
  }

  // Kalibrasyon kuruluşuna göre makineler
  async findByCalibrationOrg(orgId: number): Promise<Machine[]> {
    const sql= `
      SELECT
        m.id,
        m.serial_no,
        m.equipment_name,
        m.brand,
        m.model,
        m.measurement_range,
        m.last_calibration_date,
        m.calibration_org_id,
        m.calibration_interval,
        m.last_maintenance_date,
        m.maintenance_org_id,
        m.maintenance_interval,
        co.org_name   AS calibration_org_name,
        co.contact_name AS calibration_contact_name,
        co.email      AS calibration_email,
        co.phone      AS calibration_phone,
        mo.org_name   AS maintenance_org_name,
        mo.contact_name AS maintenance_contact_name,
        mo.email      AS maintenance_email,
        mo.phone      AS maintenance_phone
      FROM machines m
      LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
      LEFT JOIN maintenance_orgs mo ON m.maintenance_org_id = mo.id
      WHERE m.calibration_org_id = $1
      ORDER BY m.id DESC`;
    const result = await query(sql, [orgId]);
    return result.rows as Machine[];
  }

  // Bakım kuruluşuna göre makineler
  async findByMaintenanceOrg(orgId: number): Promise<Machine[]> {
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
        m.calibration_interval,
        m.last_maintenance_date,
        m.maintenance_org_id,
        m.maintenance_interval,
        co.org_name   AS calibration_org_name,
        co.contact_name AS calibration_contact_name,
        co.email      AS calibration_email,
        co.phone      AS calibration_phone,
        mo.org_name   AS maintenance_org_name,
        mo.contact_name AS maintenance_contact_name,
        mo.email      AS maintenance_email,
        mo.phone      AS maintenance_phone
      FROM machines m
      LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
      LEFT JOIN maintenance_orgs mo ON m.maintenance_org_id = mo.id
      WHERE m.maintenance_org_id = $1
      ORDER BY m.id DESC`;
    const result = await query(sql, [orgId]);
    return result.rows as Machine[];
  }

  // Kalibrasyon tarihini güncelle
  async updateCalibrationDate(id: number, calibrationDate: string): Promise<Machine | null> {
    if (isSQLite) {
      await query(`UPDATE machines SET last_calibration_date = $1 WHERE id = $2`, [calibrationDate, id]);
      return (await this.findById(id)) as Machine;
    } else {
      const result = await query(`UPDATE machines SET last_calibration_date = $1 WHERE id = $2 RETURNING id`, [calibrationDate, id]);
      if (result.rows.length === 0) return null;
      return (await this.findById(id)) as Machine;
    }
  }

  // Bakım tarihini güncelle
  async updateMaintenanceDate(id: number, maintenanceDate: string): Promise<Machine | null> {
    if (isSQLite) {
      await query(`UPDATE machines SET last_maintenance_date = $1 WHERE id = $2`, [maintenanceDate, id]);
      return (await this.findById(id)) as Machine;
    } else {
      const result = await query(`UPDATE machines SET last_maintenance_date = $1 WHERE id = $2 RETURNING id`, [maintenanceDate, id]);
      if (result.rows.length === 0) return null;
      return (await this.findById(id)) as Machine;
    }
  }

  // Kalibrasyon uyarıları
  async getCalibrationAlerts(): Promise<{
    expired: Machine[];
    expiringSoon: Machine[];
    totalExpired: number;
    totalExpiringSoon: number;
  }> {
    let expiredQuery: string;
    let expiringSoonQuery: string;
    if (isSQLite) {
      expiredQuery = `
        SELECT
          m.id, m.serial_no, m.equipment_name, m.brand, m.model, m.measurement_range,
          m.last_calibration_date, m.calibration_org_id, m.calibration_interval,
          co.org_name AS calibration_org_name, co.contact_name AS calibration_contact_name,
          co.email AS calibration_email, co.phone AS calibration_phone,
          DATE(m.last_calibration_date, '+' || m.calibration_interval || ' years') AS next_calibration_date,
          CAST(julianday('now') - julianday(DATE(m.last_calibration_date, '+' || m.calibration_interval || ' years')) AS INTEGER) AS days_overdue
        FROM machines m
        LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
        WHERE DATE(m.last_calibration_date, '+' || m.calibration_interval || ' years') < DATE('now')
        ORDER BY m.last_calibration_date ASC`;
      expiringSoonQuery = `
        SELECT
          m.id, m.serial_no, m.equipment_name, m.brand, m.model, m.measurement_range,
          m.last_calibration_date, m.calibration_org_id, m.calibration_interval,
          co.org_name AS calibration_org_name, co.contact_name AS calibration_contact_name,
          co.email AS calibration_email, co.phone AS calibration_phone,
          DATE(m.last_calibration_date, '+' || m.calibration_interval || ' years') AS next_calibration_date,
          CAST(julianday(DATE(m.last_calibration_date, '+' || m.calibration_interval || ' years')) - julianday('now') AS INTEGER) AS days_remaining
        FROM machines m
        LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
        WHERE DATE(m.last_calibration_date, '+' || m.calibration_interval || ' years') >= DATE('now')
          AND DATE(m.last_calibration_date, '+' || m.calibration_interval || ' years') <= DATE('now', '+30 days')
        ORDER BY m.last_calibration_date ASC`;
    } else {
      expiredQuery = `
        SELECT
          m.id, m.serial_no, m.equipment_name, m.brand, m.model, m.measurement_range,
          m.last_calibration_date, m.calibration_org_id, m.calibration_interval,
          co.org_name AS calibration_org_name, co.contact_name AS calibration_contact_name,
          co.email AS calibration_email, co.phone AS calibration_phone,
          (m.last_calibration_date + (m.calibration_interval * INTERVAL '1 year')) AS next_calibration_date,
          EXTRACT(DAYS FROM (CURRENT_DATE - (m.last_calibration_date + (m.calibration_interval * INTERVAL '1 year')))) AS days_overdue
        FROM machines m
        LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
        WHERE (m.last_calibration_date + (m.calibration_interval * INTERVAL '1 year')) < CURRENT_DATE
        ORDER BY m.last_calibration_date ASC`;
      expiringSoonQuery = `
        SELECT
          m.id, m.serial_no, m.equipment_name, m.brand, m.model, m.measurement_range,
          m.last_calibration_date, m.calibration_org_id, m.calibration_interval,
          co.org_name AS calibration_org_name, co.contact_name AS calibration_contact_name,
          co.email AS calibration_email, co.phone AS calibration_phone,
          (m.last_calibration_date + (m.calibration_interval * INTERVAL '1 year')) AS next_calibration_date,
          EXTRACT(DAYS FROM ((m.last_calibration_date + (m.calibration_interval * INTERVAL '1 year')) - CURRENT_DATE)) AS days_remaining
        FROM machines m
        LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
        WHERE (m.last_calibration_date + (m.calibration_interval * INTERVAL '1 year')) >= CURRENT_DATE
          AND (m.last_calibration_date + (m.calibration_interval * INTERVAL '1 year')) <= (CURRENT_DATE + INTERVAL '30 days')
        ORDER BY m.last_calibration_date ASC`;
    }
    const [expiredResult, expiringSoonResult] = await Promise.all([
      query(expiredQuery),
      query(expiringSoonQuery),
    ]);
    return {
      expired: expiredResult.rows as Machine[],
      expiringSoon: expiringSoonResult.rows as Machine[],
      totalExpired: expiredResult.rows.length,
      totalExpiringSoon: expiringSoonResult.rows.length,
    };
  }

  // Bakım uyarıları
  async getMaintenanceAlerts(): Promise<{
    expired: Machine[];
    expiringSoon: Machine[];
    totalExpired: number;
    totalExpiringSoon: number;
  }> {
    let expiredQuery: string;
    let expiringSoonQuery: string;
    if (isSQLite) {
      expiredQuery = `
        SELECT
          m.id, m.serial_no, m.equipment_name, m.brand, m.model, m.measurement_range,
          m.last_maintenance_date, m.maintenance_org_id, m.maintenance_interval,
          mo.org_name AS maintenance_org_name, mo.contact_name AS maintenance_contact_name,
          mo.email AS maintenance_email, mo.phone AS maintenance_phone,
          DATE(m.last_maintenance_date, '+' || m.maintenance_interval || ' years') AS next_maintenance_date,
          CAST(julianday('now') - julianday(DATE(m.last_maintenance_date, '+' || m.maintenance_interval || ' years')) AS INTEGER) AS days_overdue
        FROM machines m
        LEFT JOIN maintenance_orgs mo ON m.maintenance_org_id = mo.id
        WHERE DATE(m.last_maintenance_date, '+' || m.maintenance_interval || ' years') < DATE('now')
        ORDER BY m.last_maintenance_date ASC`;
      expiringSoonQuery = `
        SELECT
          m.id, m.serial_no, m.equipment_name, m.brand, m.model, m.measurement_range,
          m.last_maintenance_date, m.maintenance_org_id, m.maintenance_interval,
          mo.org_name AS maintenance_org_name, mo.contact_name AS maintenance_contact_name,
          mo.email AS maintenance_email, mo.phone AS maintenance_phone,
          DATE(m.last_maintenance_date, '+' || m.maintenance_interval || ' years') AS next_maintenance_date,
          CAST(julianday(DATE(m.last_maintenance_date, '+' || m.maintenance_interval || ' years')) - julianday('now') AS INTEGER) AS days_remaining
        FROM machines m
        LEFT JOIN maintenance_orgs mo ON m.maintenance_org_id = mo.id
        WHERE DATE(m.last_maintenance_date, '+' || m.maintenance_interval || ' years') >= DATE('now')
          AND DATE(m.last_maintenance_date, '+' || m.maintenance_interval || ' years') <= DATE('now', '+30 days')
        ORDER BY m.last_maintenance_date ASC`;
    } else {
      expiredQuery = `
        SELECT
          m.id, m.serial_no, m.equipment_name, m.brand, m.model, m.measurement_range,
          m.last_maintenance_date, m.maintenance_org_id, m.maintenance_interval,
          mo.org_name AS maintenance_org_name, mo.contact_name AS maintenance_contact_name,
          mo.email AS maintenance_email, mo.phone AS maintenance_phone,
          (m.last_maintenance_date + (m.maintenance_interval * INTERVAL '1 year')) AS next_maintenance_date,
          EXTRACT(DAYS FROM (CURRENT_DATE - (m.last_maintenance_date + (m.maintenance_interval * INTERVAL '1 year')))) AS days_overdue
        FROM machines m
        LEFT JOIN maintenance_orgs mo ON m.maintenance_org_id = mo.id
        WHERE (m.last_maintenance_date + (m.maintenance_interval * INTERVAL '1 year')) < CURRENT_DATE
        ORDER BY m.last_maintenance_date ASC`;
      expiringSoonQuery = `
        SELECT
          m.id, m.serial_no, m.equipment_name, m.brand, m.model, m.measurement_range,
          m.last_maintenance_date, m.maintenance_org_id, m.maintenance_interval,
          mo.org_name AS maintenance_org_name, mo.contact_name AS maintenance_contact_name,
          mo.email AS maintenance_email, mo.phone AS maintenance_phone,
          (m.last_maintenance_date + (m.maintenance_interval * INTERVAL '1 year')) AS next_maintenance_date,
          EXTRACT(DAYS FROM ((m.last_maintenance_date + (m.maintenance_interval * INTERVAL '1 year')) - CURRENT_DATE)) AS days_remaining
        FROM machines m
        LEFT JOIN maintenance_orgs mo ON m.maintenance_org_id = mo.id
        WHERE (m.last_maintenance_date + (m.maintenance_interval * INTERVAL '1 year')) >= CURRENT_DATE
          AND (m.last_maintenance_date + (m.maintenance_interval * INTERVAL '1 year')) <= (CURRENT_DATE + INTERVAL '30 days')
        ORDER BY m.last_maintenance_date ASC`;
    }
    const [expiredResult, expiringSoonResult] = await Promise.all([
      query(expiredQuery),
      query(expiringSoonQuery),
    ]);
    return {
      expired: expiredResult.rows as Machine[],
      expiringSoon: expiringSoonResult.rows as Machine[],
      totalExpired: expiredResult.rows.length,
      totalExpiringSoon: expiringSoonResult.rows.length,
    };
  }
}
