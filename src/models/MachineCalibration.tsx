// Makine Kalibrasyon Geçmişi Model

export interface MachineCalibration {
  id: number;
  machine_id: number;
  calibration_org_id: number;
  calibrated_by?: string;
  notes?: string;
  calibration_date: Date;
  created_at?: Date;
  
  // Join fields from backend
  machine_name?: string;
  machine_serial_no?: string;
  machine_brand?: string;
  machine_model?: string;
  calibration_org_name?: string;
  calibration_contact_name?: string;
  calibration_email?: string;
  calibration_phone?: string;
  
  // Original join fields (keeping for compatibility)
  machine?: {
    id: number;
    serial_no: string;
    equipment_name: string;
    brand?: string;
    model?: string;
  };
  
  calibration_org?: {
    id: number;
    org_name: string;
    contact_name?: string;
    email?: string;
    phone?: string;
  };
}

export interface MachineCalibrationInput {
  machine_id: number;
  calibration_org_id: number;
  calibrated_by: string; // Artık zorunlu
  notes?: string;
  calibration_date: Date;
}

// Kalibrasyon geçmiş raporlama için
export interface MachineCalibrationReport {
  id: number;
  machine_id: number;
  machine_name: string;
  serial_no: string;
  calibration_org_name: string;
  calibrated_by?: string;
  calibration_date: string;
  days_ago: number;
}
