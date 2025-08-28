// Makine Bakım Geçmişi Model

export interface MachineMaintenance {
  id: number;
  machine_id: number;
  maintenance_org_id: number;
  maintained_by?: string;
  notes?: string;
  maintenance_date: Date;
  next_maintenance_date?: Date;
  created_at?: Date;

  // Join fields from backend
  machine_name?: string;
  machine_serial_no?: string;
  machine_brand?: string;
  machine_model?: string;
  maintenance_org_name?: string;
  maintenance_contact_name?: string;
  maintenance_email?: string;
  maintenance_phone?: string;

  // Original join fields (keeping for compatibility)
  machine?: {
    id: number;
    serial_no: string;
    equipment_name: string;
    brand?: string;
    model?: string;
  };

  maintenance_org?: {
    id: number;
    org_name: string;
    contact_name?: string;
    email?: string;
    phone?: string;
  };
}

export interface MachineMaintenanceInput {
  machine_id: number;
  maintenance_org_id: number;
  maintained_by: string;
  notes?: string;
  maintenance_date: Date;
  next_maintenance_date?: Date;
}

// Bakım geçmiş raporlama için
export interface MachineMaintenanceReport {
  id: number;
  machine_id: number;
  machine_name: string;
  serial_no: string;
  maintenance_org_name: string;
  maintained_by?: string;
  maintenance_date: string;
  next_maintenance_date?: string;
  days_ago: number;
}