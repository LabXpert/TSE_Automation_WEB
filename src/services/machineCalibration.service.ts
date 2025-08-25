import type { MachineCalibration, MachineCalibrationInput } from '../models/MachineCalibration';

const API_BASE_URL = 'http://localhost:3001/api';

// Tüm kalibrasyon kayıtlarını getir
export const getAllMachineCalibrations = async (): Promise<MachineCalibration[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-calibrations`);
    if (!response.ok) {
      throw new Error('Kalibrasyon kayıtları getirilemedi');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching machine calibrations:', error);
    throw error;
  }
};

// Belirli makineye ait kalibrasyonları getir
export const getMachineCalibrationsByMachine = async (machineId: number): Promise<MachineCalibration[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-calibrations/machine/${machineId}`);
    if (!response.ok) {
      throw new Error('Makine kalibrasyonları getirilemedi');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching machine calibrations by machine:', error);
    throw error;
  }
};

// Belirli kuruluşa ait kalibrasyonları getir
export const getMachineCalibrationsByOrg = async (orgId: number): Promise<MachineCalibration[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-calibrations/org/${orgId}`);
    if (!response.ok) {
      throw new Error('Kuruluş kalibrasyonları getirilemedi');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching calibrations by org:', error);
    throw error;
  }
};

// Tarih aralığına göre kalibrasyonları getir
export const getMachineCalibrationsByDateRange = async (startDate: string, endDate: string): Promise<MachineCalibration[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-calibrations/date-range?startDate=${startDate}&endDate=${endDate}`);
    if (!response.ok) {
      throw new Error('Tarih aralığı kalibrasyonları getirilemedi');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching calibrations by date range:', error);
    throw error;
  }
};

// Kalibrasyon istatistiklerini getir
export const getMachineCalibrationStats = async (): Promise<{
  totalCalibrations: number;
  thisMonthCalibrations: number;
  thisYearCalibrations: number;
  topCalibrationOrgs: Array<{org_name: string; count: number}>;
  monthlyCalibrations: Array<{month: string; count: number}>;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-calibrations/stats`);
    if (!response.ok) {
      throw new Error('Kalibrasyon istatistikleri getirilemedi');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching calibration stats:', error);
    throw error;
  }
};

// Makinenin son kalibrasyonunu getir
export const getLastMachineCalibration = async (machineId: number): Promise<MachineCalibration | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-calibrations/machine/${machineId}/last`);
    if (!response.ok) {
      throw new Error('Son kalibrasyon kaydı getirilemedi');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching last calibration:', error);
    throw error;
  }
};

// Kalibrasyon geçmişi raporu getir
export const getMachineCalibrationHistory = async (machineId?: number, orgId?: number, limit: number = 100): Promise<MachineCalibration[]> => {
  try {
    const params = new URLSearchParams();
    if (machineId) params.append('machineId', machineId.toString());
    if (orgId) params.append('orgId', orgId.toString());
    params.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/machine-calibrations/history?${params}`);
    if (!response.ok) {
      throw new Error('Kalibrasyon geçmişi getirilemedi');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching calibration history:', error);
    throw error;
  }
};

// Belirli bir kalibrasyon kaydını getir
export const getMachineCalibrationById = async (id: number): Promise<MachineCalibration> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-calibrations/${id}`);
    if (!response.ok) {
      throw new Error('Kalibrasyon kaydı getirilemedi');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching calibration:', error);
    throw error;
  }
};

// Yeni kalibrasyon kaydı oluştur
export const createMachineCalibration = async (calibrationData: MachineCalibrationInput): Promise<MachineCalibration> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-calibrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(calibrationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Kalibrasyon kaydı oluşturulamadı');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating calibration:', error);
    throw error;
  }
};

// Makine kalibre et (özel endpoint)
export const calibrateMachine = async (
  machineId: number, 
  calibrationData: Omit<MachineCalibrationInput, 'machine_id'>
): Promise<MachineCalibration> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-calibrations/calibrate/${machineId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        calibration_org_id: calibrationData.calibration_org_id,
        calibrated_by: calibrationData.calibrated_by,
        notes: calibrationData.notes,
        calibration_date: calibrationData.calibration_date
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Makine kalibre edilemedi');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error calibrating machine:', error);
    throw error;
  }
};

// Kalibrasyon kaydını güncelle
export const updateMachineCalibration = async (
  id: number, 
  calibrationData: Partial<MachineCalibrationInput>
): Promise<MachineCalibration> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-calibrations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(calibrationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Kalibrasyon kaydı güncellenemedi');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating calibration:', error);
    throw error;
  }
};

// Kalibrasyon kaydını sil
export const deleteMachineCalibration = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-calibrations/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Kalibrasyon kaydı silinemedi');
    }
  } catch (error) {
    console.error('Error deleting calibration:', error);
    throw error;
  }
};
