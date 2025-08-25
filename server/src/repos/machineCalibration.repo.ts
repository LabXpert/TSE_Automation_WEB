import { Pool } from 'pg';

// Makine kalibrasyon geçmişi tipi
export interface MachineCalibration {
  id: number;
  machine_id: number;
  calibration_org_id: number;
  calibrated_by?: string;
  notes?: string;
  calibration_date: string;
  created_at?: string;
  
  // Join fields
  machine_name?: string;
  machine_serial_no?: string;
  machine_brand?: string;
  machine_model?: string;
  calibration_org_name?: string;
  calibration_contact_name?: string;
  calibration_email?: string;
  calibration_phone?: string;
}

// Kalibrasyon kaydı oluşturma/güncelleme için input tipi
export interface MachineCalibrationInput {
  machine_id: number;
  calibration_org_id: number;
  calibrated_by: string; // Artık zorunlu
  notes?: string;
  calibration_date: string;
}

export class MachineCalibrationRepository {
  constructor(private db: Pool) {}

  // Tüm kalibrasyon kayıtlarını getir
  async findAll(): Promise<MachineCalibration[]> {
    try {
      console.log('Executing findAll query for machine calibrations...');
      const query = `
        SELECT 
          mc.id,
          mc.machine_id,
          mc.calibration_org_id,
          mc.calibrated_by,
          mc.notes,
          mc.calibration_date,
          mc.created_at,
          m.equipment_name as machine_name,
          m.serial_no as machine_serial_no,
          m.brand as machine_brand,
          m.model as machine_model,
          co.org_name as calibration_org_name,
          co.contact_name as calibration_contact_name,
          co.email as calibration_email,
          co.phone as calibration_phone
        FROM machine_calibrations mc
        LEFT JOIN machines m ON mc.machine_id = m.id
        LEFT JOIN calibration_orgs co ON mc.calibration_org_id = co.id
        ORDER BY mc.calibration_date DESC, mc.created_at DESC
      `;
      
      const result = await this.db.query(query);
      console.log('Query result:', result.rows.length, 'calibration records');
      return result.rows;
    } catch (error) {
      console.error('Database query error in findAll:', error);
      throw error;
    }
  }

  // ID ile kalibrasyon kaydı getir
  async findById(id: number): Promise<MachineCalibration | null> {
    const query = `
      SELECT 
        mc.id,
        mc.machine_id,
        mc.calibration_org_id,
        mc.calibrated_by,
        mc.notes,
        mc.calibration_date,
        mc.created_at,
        m.equipment_name as machine_name,
        m.serial_no as machine_serial_no,
        m.brand as machine_brand,
        m.model as machine_model,
        co.org_name as calibration_org_name,
        co.contact_name as calibration_contact_name,
        co.email as calibration_email,
        co.phone as calibration_phone
      FROM machine_calibrations mc
      LEFT JOIN machines m ON mc.machine_id = m.id
      LEFT JOIN calibration_orgs co ON mc.calibration_org_id = co.id
      WHERE mc.id = $1
    `;
    
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  // Makine ID'sine göre kalibrasyon geçmişini getir
  async findByMachineId(machineId: number): Promise<MachineCalibration[]> {
    const query = `
      SELECT 
        mc.id,
        mc.machine_id,
        mc.calibration_org_id,
        mc.calibrated_by,
        mc.notes,
        mc.calibration_date,
        mc.created_at,
        m.equipment_name as machine_name,
        m.serial_no as machine_serial_no,
        m.brand as machine_brand,
        m.model as machine_model,
        co.org_name as calibration_org_name,
        co.contact_name as calibration_contact_name,
        co.email as calibration_email,
        co.phone as calibration_phone
      FROM machine_calibrations mc
      LEFT JOIN machines m ON mc.machine_id = m.id
      LEFT JOIN calibration_orgs co ON mc.calibration_org_id = co.id
      WHERE mc.machine_id = $1
      ORDER BY mc.calibration_date DESC, mc.created_at DESC
    `;
    
    const result = await this.db.query(query, [machineId]);
    return result.rows;
  }

  // Kalibrasyon kuruluşuna göre kayıtları getir
  async findByCalibrationOrgId(orgId: number): Promise<MachineCalibration[]> {
    const query = `
      SELECT 
        mc.id,
        mc.machine_id,
        mc.calibration_org_id,
        mc.calibrated_by,
        mc.notes,
        mc.calibration_date,
        mc.created_at,
        m.equipment_name as machine_name,
        m.serial_no as machine_serial_no,
        m.brand as machine_brand,
        m.model as machine_model,
        co.org_name as calibration_org_name,
        co.contact_name as calibration_contact_name,
        co.email as calibration_email,
        co.phone as calibration_phone
      FROM machine_calibrations mc
      LEFT JOIN machines m ON mc.machine_id = m.id
      LEFT JOIN calibration_orgs co ON mc.calibration_org_id = co.id
      WHERE mc.calibration_org_id = $1
      ORDER BY mc.calibration_date DESC, mc.created_at DESC
    `;
    
    const result = await this.db.query(query, [orgId]);
    return result.rows;
  }

  // Yeni kalibrasyon kaydı oluştur
  async create(calibrationData: MachineCalibrationInput): Promise<MachineCalibration> {
    try {
      // Transaction başlat
      await this.db.query('BEGIN');

      // Kalibrasyon kaydı oluştur
      const insertQuery = `
        INSERT INTO machine_calibrations (
          machine_id, 
          calibration_org_id, 
          calibrated_by, 
          notes,
          calibration_date
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      const values = [
        calibrationData.machine_id,
        calibrationData.calibration_org_id,
        calibrationData.calibrated_by || null,
        calibrationData.notes || null,
        calibrationData.calibration_date
      ];
      
      const insertResult = await this.db.query(insertQuery, values);
      
      // Makinenin son kalibrasyon tarihini güncelle
      const updateMachineQuery = `
        UPDATE machines 
        SET last_calibration_date = $1, calibration_org_id = $2
        WHERE id = $3
      `;
      
      await this.db.query(updateMachineQuery, [
        calibrationData.calibration_date,
        calibrationData.calibration_org_id,
        calibrationData.machine_id
      ]);

      // Transaction commit
      await this.db.query('COMMIT');
      
      // Tam veriyi getir
      return await this.findById(insertResult.rows[0].id) as MachineCalibration;
    } catch (error) {
      // Transaction rollback
      await this.db.query('ROLLBACK');
      console.error('Error creating machine calibration:', error);
      throw error;
    }
  }

  // Kalibrasyon kaydını güncelle
  async update(id: number, calibrationData: Partial<MachineCalibrationInput>): Promise<MachineCalibration | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (calibrationData.machine_id !== undefined) {
      fields.push(`machine_id = $${paramIndex++}`);
      values.push(calibrationData.machine_id);
    }
    if (calibrationData.calibration_org_id !== undefined) {
      fields.push(`calibration_org_id = $${paramIndex++}`);
      values.push(calibrationData.calibration_org_id);
    }
    if (calibrationData.calibrated_by !== undefined) {
      fields.push(`calibrated_by = $${paramIndex++}`);
      values.push(calibrationData.calibrated_by);
    }
    if (calibrationData.notes !== undefined) {
      fields.push(`notes = $${paramIndex++}`);
      values.push(calibrationData.notes);
    }
    if (calibrationData.calibration_date !== undefined) {
      fields.push(`calibration_date = $${paramIndex++}`);
      values.push(calibrationData.calibration_date);
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE machine_calibrations 
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

  // Kalibrasyon kaydını sil
  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM machine_calibrations WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Belirli tarih aralığındaki kalibrasyonları getir
  async findByDateRange(startDate: string, endDate: string): Promise<MachineCalibration[]> {
    const query = `
      SELECT 
        mc.id,
        mc.machine_id,
        mc.calibration_org_id,
        mc.calibrated_by,
        mc.notes,
        mc.calibration_date,
        mc.created_at,
        m.equipment_name as machine_name,
        m.serial_no as machine_serial_no,
        m.brand as machine_brand,
        m.model as machine_model,
        co.org_name as calibration_org_name,
        co.contact_name as calibration_contact_name,
        co.email as calibration_email,
        co.phone as calibration_phone
      FROM machine_calibrations mc
      LEFT JOIN machines m ON mc.machine_id = m.id
      LEFT JOIN calibration_orgs co ON mc.calibration_org_id = co.id
      WHERE mc.calibration_date BETWEEN $1 AND $2
      ORDER BY mc.calibration_date DESC, mc.created_at DESC
    `;
    
    const result = await this.db.query(query, [startDate, endDate]);
    return result.rows;
  }

  // Kalibrasyon istatistikleri
  async getCalibrationStats(): Promise<{
    totalCalibrations: number;
    thisMonthCalibrations: number;
    thisYearCalibrations: number;
    topCalibrationOrgs: Array<{org_name: string; count: number}>;
    monthlyCalibrations: Array<{month: string; count: number}>;
  }> {
    try {
      // Toplam kalibrasyon sayısı
      const totalQuery = 'SELECT COUNT(*) as total FROM machine_calibrations';
      const totalResult = await this.db.query(totalQuery);

      // Bu ay yapılan kalibrasyonlar
      const thisMonthQuery = `
        SELECT COUNT(*) as count 
        FROM machine_calibrations 
        WHERE EXTRACT(YEAR FROM calibration_date) = EXTRACT(YEAR FROM CURRENT_DATE)
          AND EXTRACT(MONTH FROM calibration_date) = EXTRACT(MONTH FROM CURRENT_DATE)
      `;
      const thisMonthResult = await this.db.query(thisMonthQuery);

      // Bu yıl yapılan kalibrasyonlar
      const thisYearQuery = `
        SELECT COUNT(*) as count 
        FROM machine_calibrations 
        WHERE EXTRACT(YEAR FROM calibration_date) = EXTRACT(YEAR FROM CURRENT_DATE)
      `;
      const thisYearResult = await this.db.query(thisYearQuery);

      // En çok kalibrasyon yapan kuruluşlar
      const topOrgsQuery = `
        SELECT co.org_name, COUNT(*) as count
        FROM machine_calibrations mc
        LEFT JOIN calibration_orgs co ON mc.calibration_org_id = co.id
        GROUP BY co.org_name
        ORDER BY count DESC
        LIMIT 5
      `;
      const topOrgsResult = await this.db.query(topOrgsQuery);

      // Aylık kalibrasyon dağılımı (son 12 ay)
      const monthlyQuery = `
        SELECT 
          TO_CHAR(calibration_date, 'YYYY-MM') as month,
          COUNT(*) as count
        FROM machine_calibrations 
        WHERE calibration_date >= CURRENT_DATE - INTERVAL '12 months'
        GROUP BY TO_CHAR(calibration_date, 'YYYY-MM')
        ORDER BY month DESC
      `;
      const monthlyResult = await this.db.query(monthlyQuery);

      return {
        totalCalibrations: parseInt(totalResult.rows[0].total),
        thisMonthCalibrations: parseInt(thisMonthResult.rows[0].count),
        thisYearCalibrations: parseInt(thisYearResult.rows[0].count),
        topCalibrationOrgs: topOrgsResult.rows,
        monthlyCalibrations: monthlyResult.rows
      };
    } catch (error) {
      console.error('Error getting calibration stats:', error);
      throw error;
    }
  }

  // Makine için son kalibrasyon kaydını getir
  async getLastCalibrationByMachine(machineId: number): Promise<MachineCalibration | null> {
    const query = `
      SELECT 
        mc.id,
        mc.machine_id,
        mc.calibration_org_id,
        mc.calibrated_by,
        mc.notes,
        mc.calibration_date,
        mc.created_at,
        m.equipment_name as machine_name,
        m.serial_no as machine_serial_no,
        m.brand as machine_brand,
        m.model as machine_model,
        co.org_name as calibration_org_name,
        co.contact_name as calibration_contact_name,
        co.email as calibration_email,
        co.phone as calibration_phone
      FROM machine_calibrations mc
      LEFT JOIN machines m ON mc.machine_id = m.id
      LEFT JOIN calibration_orgs co ON mc.calibration_org_id = co.id
      WHERE mc.machine_id = $1
      ORDER BY mc.calibration_date DESC, mc.created_at DESC
      LIMIT 1
    `;
    
    const result = await this.db.query(query, [machineId]);
    return result.rows[0] || null;
  }
}
