import { Pool } from 'pg';

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
  constructor(private db: Pool) {}

  // Tüm makineleri getir (kalibrasyon/bakım kuruluşları ile)
  async findAll(): Promise<Machine[]> {
    try {
      const query = `
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

      const result = await this.db.query(query);
      return result.rows || [];
    } catch (error) {
      console.error('Database query error in findAll:', error);
      return [];
    }
  }

  // ID ile makine getir
  async findById(id: number): Promise<Machine | null> {
    const query = `
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
    const result = await this.db.query(query, [id]);
    if (result.rows.length === 0) return null;
    return result.rows[0] as Machine;
  }

  // Yeni makine oluştur
  async create(machineData: MachineInput): Promise<Machine> {
    const query = `
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
      RETURNING id`;
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
    const result = await this.db.query(query, values);
    return (await this.findById(result.rows[0].id)) as Machine;
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
    const query = `UPDATE machines SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id`;
    const result = await this.db.query(query, values);
    if (result.rows.length === 0) return null;
    return (await this.findById(id)) as Machine;
  }

  // Makine sil
  async delete(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM machines WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Makine ara
  async search(searchTerm: string): Promise<Machine[]> {
    const like = `%${searchTerm}%`;
    const query = `
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
      WHERE m.equipment_name ILIKE $1 OR m.serial_no ILIKE $1 OR m.brand ILIKE $1 OR m.model ILIKE $1
      ORDER BY m.id DESC`;
    const result = await this.db.query(query, [like]);
    return result.rows as Machine[];
  }

  // Yakında kalibrasyonu dolacak makineler
  async findExpiringCalibrations(days: number): Promise<Machine[]> {
    const query = `
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
    const result = await this.db.query(query, [String(days)]);
    return result.rows as Machine[];
  }

  // Yakında bakımı dolacak makineler
  async findExpiringMaintenances(days: number): Promise<Machine[]> {
    const query = `
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
    const result = await this.db.query(query, [String(days)]);
    return result.rows as Machine[];
  }

  // Kalibrasyon kuruluşuna göre makineler
  async findByCalibrationOrg(orgId: number): Promise<Machine[]> {
    const query = `
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
    const result = await this.db.query(query, [orgId]);
    return result.rows as Machine[];
  }

  // Bakım kuruluşuna göre makineler
  async findByMaintenanceOrg(orgId: number): Promise<Machine[]> {
    const query = `
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
    const result = await this.db.query(query, [orgId]);
    return result.rows as Machine[];
  }

  // Kalibrasyon tarihini güncelle
  async updateCalibrationDate(id: number, calibrationDate: string): Promise<Machine | null> {
    const result = await this.db.query(
      `UPDATE machines SET last_calibration_date = $1 WHERE id = $2 RETURNING id`,
      [calibrationDate, id]
    );
    if (result.rows.length === 0) return null;
    return (await this.findById(id)) as Machine;
  }

  // Bakım tarihini güncelle
  async updateMaintenanceDate(id: number, maintenanceDate: string): Promise<Machine | null> {
    const result = await this.db.query(
      `UPDATE machines SET last_maintenance_date = $1 WHERE id = $2 RETURNING id`,
      [maintenanceDate, id]
    );
    if (result.rows.length === 0) return null;
    return (await this.findById(id)) as Machine;
  }

  // Kalibrasyon uyarıları
  async getCalibrationAlerts(): Promise<{
    expired: Machine[];
    expiringSoon: Machine[];
    totalExpired: number;
    totalExpiringSoon: number;
  }> {
    const expiredQuery = `
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
    const expiringSoonQuery = `
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
    const [expiredResult, expiringSoonResult] = await Promise.all([
      this.db.query(expiredQuery),
      this.db.query(expiringSoonQuery),
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
    const expiredQuery = `
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
    const expiringSoonQuery = `
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
    const [expiredResult, expiringSoonResult] = await Promise.all([
      this.db.query(expiredQuery),
      this.db.query(expiringSoonQuery),
    ]);
    return {
      expired: expiredResult.rows as Machine[],
      expiringSoon: expiringSoonResult.rows as Machine[],
      totalExpired: expiredResult.rows.length,
      totalExpiringSoon: expiringSoonResult.rows.length,
    };
  }
}
