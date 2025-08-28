import { query, getClient, isSQLite } from '../db';

// Makine bakım geçmişi tipi
export interface MachineMaintenance {
  id: number;
  machine_id: number;
  maintenance_org_id: number;
  maintained_by?: string;
  notes?: string;
  maintenance_date: string;
  next_maintenance_date?: string;
  created_at?: string;

  // Join fields
  machine_name?: string;
  machine_serial_no?: string;
  machine_brand?: string;
  machine_model?: string;
  maintenance_org_name?: string;
  maintenance_contact_name?: string;
  maintenance_email?: string;
  maintenance_phone?: string;
}

// Bakım kaydı oluşturma/güncelleme için input tipi
export interface MachineMaintenanceInput {
  machine_id: number;
  maintenance_org_id: number;
  maintained_by: string;
  notes?: string;
  maintenance_date: string;
  next_maintenance_date?: string;
}

export class MachineMaintenanceRepository {

  async findAll(): Promise<MachineMaintenance[]> {
    const sql = `
      SELECT
        mm.id,
        mm.machine_id,
        mm.maintenance_org_id,
        mm.maintained_by,
        mm.notes,
        mm.maintenance_date,
        mm.next_maintenance_date,
        mm.created_at,
        m.equipment_name as machine_name,
        m.serial_no as machine_serial_no,
        m.brand as machine_brand,
        m.model as machine_model,
        mo.org_name as maintenance_org_name,
        mo.contact_name as maintenance_contact_name,
        mo.email as maintenance_email,
        mo.phone as maintenance_phone
      FROM machine_maintenances mm
      LEFT JOIN machines m ON mm.machine_id = m.id
      LEFT JOIN maintenance_orgs mo ON mm.maintenance_org_id = mo.id
      ORDER BY mm.maintenance_date DESC, mm.created_at DESC
    `;
    const result = await query(sql);
    return result.rows;
  }

  async findById(id: number): Promise<MachineMaintenance | null> {
    const sql = `
      SELECT
        mm.id,
        mm.machine_id,
        mm.maintenance_org_id,
        mm.maintained_by,
        mm.notes,
        mm.maintenance_date,
        mm.next_maintenance_date,
        mm.created_at,
        m.equipment_name as machine_name,
        m.serial_no as machine_serial_no,
        m.brand as machine_brand,
        m.model as machine_model,
        mo.org_name as maintenance_org_name,
        mo.contact_name as maintenance_contact_name,
        mo.email as maintenance_email,
        mo.phone as maintenance_phone
      FROM machine_maintenances mm
      LEFT JOIN machines m ON mm.machine_id = m.id
      LEFT JOIN maintenance_orgs mo ON mm.maintenance_org_id = mo.id
      WHERE mm.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  async findByMachineId(machineId: number): Promise<MachineMaintenance[]> {
    const sql = `
      SELECT
        mm.id,
        mm.machine_id,
        mm.maintenance_org_id,
        mm.maintained_by,
        mm.notes,
        mm.maintenance_date,
        mm.next_maintenance_date,
        mm.created_at,
        m.equipment_name as machine_name,
        m.serial_no as machine_serial_no,
        m.brand as machine_brand,
        m.model as machine_model,
        mo.org_name as maintenance_org_name,
        mo.contact_name as maintenance_contact_name,
        mo.email as maintenance_email,
        mo.phone as maintenance_phone
      FROM machine_maintenances mm
      LEFT JOIN machines m ON mm.machine_id = m.id
      LEFT JOIN maintenance_orgs mo ON mm.maintenance_org_id = mo.id
      WHERE mm.machine_id = $1
      ORDER BY mm.maintenance_date DESC, mm.created_at DESC
    `;
    const result = await query(sql, [machineId]);
    return result.rows;
  }

  async findByMaintenanceOrgId(orgId: number): Promise<MachineMaintenance[]> {
    const sql = `
      SELECT
        mm.id,
        mm.machine_id,
        mm.maintenance_org_id,
        mm.maintained_by,
        mm.notes,
        mm.maintenance_date,
        mm.next_maintenance_date,
        mm.created_at,
        m.equipment_name as machine_name,
        m.serial_no as machine_serial_no,
        m.brand as machine_brand,
        m.model as machine_model,
        mo.org_name as maintenance_org_name,
        mo.contact_name as maintenance_contact_name,
        mo.email as maintenance_email,
        mo.phone as maintenance_phone
      FROM machine_maintenances mm
      LEFT JOIN machines m ON mm.machine_id = m.id
      LEFT JOIN maintenance_orgs mo ON mm.maintenance_org_id = mo.id
      WHERE mm.maintenance_org_id = $1
      ORDER BY mm.maintenance_date DESC, mm.created_at DESC
    `;
    const result = await query(sql, [orgId]);
    return result.rows;
  }

  async create(data: MachineMaintenanceInput): Promise<MachineMaintenance> {
    const client = await getClient();
    try {
      await client.begin();
      const baseSql = `
        INSERT INTO machine_maintenances (
          machine_id,
          maintenance_org_id,
          maintained_by,
          notes,
          maintenance_date,
          next_maintenance_date
        )
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      const values = [
        data.machine_id,
        data.maintenance_org_id,
        data.maintained_by || null,
        data.notes || null,
        data.maintenance_date,
        data.next_maintenance_date || null,
      ];
      let newId: number;
      if (isSQLite) {
        const insertResult = await client.query(baseSql, values);
        newId = insertResult.lastID!;
      } else {
        const insertResult = await client.query(baseSql + ' RETURNING id', values);
        newId = insertResult.rows[0].id;
      }
      const updateMachineSql = `
        UPDATE machines
        SET last_maintenance_date = $1, maintenance_org_id = $2
        WHERE id = $3
      `;
      await client.query(updateMachineSql, [
        data.maintenance_date,
        data.maintenance_org_id,
        data.machine_id,
      ]);

      await client.commit();

      return await this.findById(newId) as MachineMaintenance;
    } catch (error) {
      await client.rollback();
      console.error('Error creating machine maintenance:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id: number, data: Partial<MachineMaintenanceInput>): Promise<MachineMaintenance | null> {
    const fields = [] as string[];
    const values = [] as any[];
    let param = 1;

    if (data.machine_id !== undefined) {
      fields.push(`machine_id = $${param++}`);
      values.push(data.machine_id);
    }
    if (data.maintenance_org_id !== undefined) {
      fields.push(`maintenance_org_id = $${param++}`);
      values.push(data.maintenance_org_id);
    }
    if (data.maintained_by !== undefined) {
      fields.push(`maintained_by = $${param++}`);
      values.push(data.maintained_by);
    }
    if (data.notes !== undefined) {
      fields.push(`notes = $${param++}`);
      values.push(data.notes);
    }
    if (data.maintenance_date !== undefined) {
      fields.push(`maintenance_date = $${param++}`);
      values.push(data.maintenance_date);
    }
    if (data.next_maintenance_date !== undefined) {
      fields.push(`next_maintenance_date = $${param++}`);
      values.push(data.next_maintenance_date);
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const baseSql = `
      UPDATE machine_maintenances
      SET ${fields.join(', ')}
      WHERE id = $${param}
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

  async delete(id: number): Promise<boolean> {
    if (isSQLite) {
      const result = await query('DELETE FROM machine_maintenances WHERE id = $1', [id]);
      return (result.changes || 0) > 0;
    } else {
      const result = await query('DELETE FROM machine_maintenances WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    }
  }

  async findByDateRange(startDate: string, endDate: string): Promise<MachineMaintenance[]> {
    const sql = `
      SELECT
        mm.id,
        mm.machine_id,
        mm.maintenance_org_id,
        mm.maintained_by,
        mm.notes,
        mm.maintenance_date,
        mm.next_maintenance_date,
        mm.created_at,
        m.equipment_name as machine_name,
        m.serial_no as machine_serial_no,
        m.brand as machine_brand,
        m.model as machine_model,
        mo.org_name as maintenance_org_name,
        mo.contact_name as maintenance_contact_name,
        mo.email as maintenance_email,
        mo.phone as maintenance_phone
      FROM machine_maintenances mm
      LEFT JOIN machines m ON mm.machine_id = m.id
      LEFT JOIN maintenance_orgs mo ON mm.maintenance_org_id = mo.id
      WHERE mm.maintenance_date BETWEEN $1 AND $2
      ORDER BY mm.maintenance_date DESC, mm.created_at DESC
    `;
    const result = await query(sql, [startDate, endDate]);
    return result.rows;
  }

  async getMaintenanceStats(): Promise<{
    totalMaintenances: number;
    thisMonthMaintenances: number;
    thisYearMaintenances: number;
    topMaintenanceOrgs: Array<{org_name: string; count: number}>;
    monthlyMaintenances: Array<{month: string; count: number}>;
  }> {
    const totalResult = await query('SELECT COUNT(*) as total FROM machine_maintenances');


    let thisMonthQuery: string;
    let thisYearQuery: string;
    let monthlyQuery: string;
    let topOrgsResult;
    if (isSQLite) {
      thisMonthQuery = `
        SELECT COUNT(*) as count
        FROM machine_maintenances
        WHERE strftime('%Y', maintenance_date) = strftime('%Y', 'now')
          AND strftime('%m', maintenance_date) = strftime('%m', 'now')
      `;
      thisYearQuery = `
        SELECT COUNT(*) as count
        FROM machine_maintenances
        WHERE strftime('%Y', maintenance_date) = strftime('%Y', 'now')
      `;
      topOrgsResult = await query(`
        SELECT mo.org_name, COUNT(*) as count
        FROM machine_maintenances mm
        LEFT JOIN maintenance_orgs mo ON mm.maintenance_org_id = mo.id
        GROUP BY mo.org_name
        ORDER BY count DESC
        LIMIT 5
      `);
      monthlyQuery = `
        SELECT strftime('%Y-%m', maintenance_date) as month, COUNT(*) as count
        FROM machine_maintenances
        WHERE maintenance_date >= DATE('now', '-12 months')
        GROUP BY strftime('%Y-%m', maintenance_date)
        ORDER BY month DESC
      `;
    } else {
      thisMonthQuery = `
        SELECT COUNT(*) as count
        FROM machine_maintenances
        WHERE EXTRACT(YEAR FROM maintenance_date) = EXTRACT(YEAR FROM CURRENT_DATE)
          AND EXTRACT(MONTH FROM maintenance_date) = EXTRACT(MONTH FROM CURRENT_DATE)
      `;
      thisYearQuery = `
        SELECT COUNT(*) as count
        FROM machine_maintenances
        WHERE EXTRACT(YEAR FROM maintenance_date) = EXTRACT(YEAR FROM CURRENT_DATE)
      `;
      topOrgsResult = await query(`
        SELECT mo.org_name, COUNT(*) as count
        FROM machine_maintenances mm
        LEFT JOIN maintenance_orgs mo ON mm.maintenance_org_id = mo.id
        GROUP BY mo.org_name
        ORDER BY count DESC
        LIMIT 5
      `);
      monthlyQuery = `
        SELECT
          TO_CHAR(maintenance_date, 'YYYY-MM') as month,
          COUNT(*) as count
        FROM machine_maintenances
        WHERE maintenance_date >= CURRENT_DATE - INTERVAL '12 months'
        GROUP BY TO_CHAR(maintenance_date, 'YYYY-MM')
        ORDER BY month DESC
      `;
    }
    const thisMonthResult = await query(thisMonthQuery);
    const thisYearResult = await query(thisYearQuery);
    const monthlyResult = await query(monthlyQuery);

    return {
      totalMaintenances: parseInt(totalResult.rows[0].total),
      thisMonthMaintenances: parseInt(thisMonthResult.rows[0].count),
      thisYearMaintenances: parseInt(thisYearResult.rows[0].count),
      topMaintenanceOrgs: topOrgsResult.rows,
      monthlyMaintenances: monthlyResult.rows
    };
  }

  async getLastMaintenanceByMachine(machineId: number): Promise<MachineMaintenance | null> {
    const sql = `
      SELECT
        mm.id,
        mm.machine_id,
        mm.maintenance_org_id,
        mm.maintained_by,
        mm.notes,
        mm.maintenance_date,
        mm.next_maintenance_date,
        mm.created_at,
        m.equipment_name as machine_name,
        m.serial_no as machine_serial_no,
        m.brand as machine_brand,
        m.model as machine_model,
        mo.org_name as maintenance_org_name,
        mo.contact_name as maintenance_contact_name,
        mo.email as maintenance_email,
        mo.phone as maintenance_phone
      FROM machine_maintenances mm
      LEFT JOIN machines m ON mm.machine_id = m.id
      LEFT JOIN maintenance_orgs mo ON mm.maintenance_org_id = mo.id
      WHERE mm.machine_id = $1
      ORDER BY mm.maintenance_date DESC, mm.created_at DESC
      LIMIT 1
    `;
    const result = await query(sql, [machineId]);
    return result.rows[0] || null;
  }
}
