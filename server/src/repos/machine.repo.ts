import { Pool } from 'pg';

// Şemaya uygun makine tipi
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
  calibration_contact_name?: string;
  calibration_email?: string;
  calibration_phone?: string;
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
}

export class MachineRepository {
  constructor(private db: Pool) {}

  // Tüm makineleri getir (kalibrasyon kuruluş adı ile birlikte)
  async findAll(): Promise<Machine[]> {
    try {
      console.log('Executing findAll query...');
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
          co.org_name as calibration_org_name,
          co.contact_name as calibration_contact_name,
          co.email as calibration_email,
          co.phone as calibration_phone
        FROM machines m
        LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
        ORDER BY m.id DESC
      `;
      
      const result = await this.db.query(query);
      console.log('Query result:', result.rows.length, 'rows');
      return result.rows;
    } catch (error) {
      console.error('Database query error in findAll:', error);
      throw error;
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
        co.org_name as calibration_org_name,
        co.contact_name as calibration_contact_name,
        co.email as calibration_email,
        co.phone as calibration_phone
      FROM machines m
      LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
      WHERE m.id = $1
    `;
    
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
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
        calibration_org_id
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
    
    // Kalibrasyon kuruluş adını da getir
    return await this.findById(result.rows[0].id) as Machine;
  }

  // Makine güncelle
  async update(id: number, machineData: Partial<MachineInput>): Promise<Machine | null> {
    const fields = [];
    const values = [];
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
    const query = `
      UPDATE machines 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    if (result.rows.length === 0) {
      return null;
    }

    return await this.findById(id);
  }

  // Makine sil
  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM machines WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Makine ara
  async search(searchTerm: string): Promise<Machine[]> {
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
        co.org_name as calibration_org_name,
        co.contact_name as calibration_contact_name,
        co.email as calibration_email,
        co.phone as calibration_phone
      FROM machines m
      LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
      WHERE 
        LOWER(m.equipment_name) LIKE LOWER($1) OR
        LOWER(m.brand) LIKE LOWER($1) OR
        LOWER(m.model) LIKE LOWER($1) OR
        LOWER(m.serial_no) LIKE LOWER($1) OR
        LOWER(co.org_name) LIKE LOWER($1)
      ORDER BY m.id DESC
    `;
    
    const searchPattern = `%${searchTerm}%`;
    const result = await this.db.query(query, [searchPattern]);
    return result.rows;
  }

  // Kalibrasyon kuruluşuna göre makineleri getir
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
        co.org_name as calibration_org_name,
        co.contact_name as calibration_contact_name,
        co.email as calibration_email,
        co.phone as calibration_phone
      FROM machines m
      LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
      WHERE m.calibration_org_id = $1
      ORDER BY m.id DESC
    `;
    
    const result = await this.db.query(query, [orgId]);
    return result.rows;
  }

  // Kalibrasyonu yakında dolacak makineleri getir
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
        co.org_name as calibration_org_name,
        co.contact_name as calibration_contact_name,
        co.email as calibration_email,
        co.phone as calibration_phone
      FROM machines m
      LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
      WHERE m.last_calibration_date + INTERVAL '1 year' <= CURRENT_DATE + INTERVAL '${days} days'
      ORDER BY m.last_calibration_date ASC
    `;
    
    const result = await this.db.query(query);
    return result.rows;
  }

  // Kalibrasyon tarihi güncelle
  async updateCalibrationDate(id: number, calibrationDate: string): Promise<Machine | null> {
    const query = `
      UPDATE machines 
      SET last_calibration_date = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await this.db.query(query, [calibrationDate, id]);
    if (result.rows.length === 0) {
      return null;
    }

    return await this.findById(id);
  }

  // Kalibrasyon uyarıları için özel method
  async getCalibrationAlerts(): Promise<{
    expired: Machine[];
    expiringSoon: Machine[];
    totalExpired: number;
    totalExpiringSoon: number;
  }> {
    try {
      // Süresi geçenler (1 yıl + bugün geçmiş)
      const expiredQuery = `
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
          co.contact_name as calibration_contact_name,
          co.email as calibration_email,
          co.phone as calibration_phone,
          (m.last_calibration_date + INTERVAL '1 year') as next_calibration_date,
          EXTRACT(DAYS FROM (CURRENT_DATE - (m.last_calibration_date + INTERVAL '1 year'))) as days_overdue
        FROM machines m
        LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
        WHERE m.last_calibration_date + INTERVAL '1 year' < CURRENT_DATE
        ORDER BY m.last_calibration_date ASC
      `;

      // 30 gün içinde süresi dolacaklar
      const expiringSoonQuery = `
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
          co.contact_name as calibration_contact_name,
          co.email as calibration_email,
          co.phone as calibration_phone,
          (m.last_calibration_date + INTERVAL '1 year') as next_calibration_date,
          EXTRACT(DAYS FROM ((m.last_calibration_date + INTERVAL '1 year') - CURRENT_DATE)) as days_remaining
        FROM machines m
        LEFT JOIN calibration_orgs co ON m.calibration_org_id = co.id
        WHERE m.last_calibration_date + INTERVAL '1 year' >= CURRENT_DATE 
          AND m.last_calibration_date + INTERVAL '1 year' <= CURRENT_DATE + INTERVAL '30 days'
        ORDER BY m.last_calibration_date ASC
      `;

      const [expiredResult, expiringSoonResult] = await Promise.all([
        this.db.query(expiredQuery),
        this.db.query(expiringSoonQuery)
      ]);

      return {
        expired: expiredResult.rows,
        expiringSoon: expiringSoonResult.rows,
        totalExpired: expiredResult.rows.length,
        totalExpiringSoon: expiringSoonResult.rows.length
      };
    } catch (error) {
      console.error('Database query error in getCalibrationAlerts:', error);
      throw error;
    }
  }
}
