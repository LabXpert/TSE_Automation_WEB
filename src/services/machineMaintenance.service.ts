import type { MachineMaintenance, MachineMaintenanceInput } from '../models/MachineMaintenance';

const API_BASE_URL = 'http://localhost:3001/api';

// Tüm bakım kayıtlarını getir
export const getAllMachineMaintenances = async (): Promise<MachineMaintenance[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-maintenances`);
    if (!response.ok) {
      throw new Error('Bakım kayıtları getirilemedi');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching machine maintenances:', error);
    throw error;
  }
};

// Belirli makineye ait bakımları getir
export const getMachineMaintenancesByMachine = async (machineId: number): Promise<MachineMaintenance[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-maintenances/machine/${machineId}`);
    if (!response.ok) {
      throw new Error('Makine bakımları getirilemedi');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching machine maintenances by machine:', error);
    throw error;
  }
};

// Belirli kuruluşa ait bakımları getir
export const getMachineMaintenancesByOrg = async (orgId: number): Promise<MachineMaintenance[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-maintenances/org/${orgId}`);
    if (!response.ok) {
      throw new Error('Kuruluş bakımları getirilemedi');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching maintenances by org:', error);
    throw error;
  }
};

// Tarih aralığına göre bakımları getir
export const getMachineMaintenancesByDateRange = async (startDate: string, endDate: string): Promise<MachineMaintenance[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-maintenances/date-range?startDate=${startDate}&endDate=${endDate}`);
    if (!response.ok) {
      throw new Error('Tarih aralığı bakımları getirilemedi');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching maintenances by date range:', error);
    throw error;
  }
};

// Bakım istatistiklerini getir
export const getMachineMaintenanceStats = async (): Promise<{
  totalMaintenances: number;
  thisMonthMaintenances: number;
  thisYearMaintenances: number;
  topMaintenanceOrgs: Array<{org_name: string; count: number}>;
  monthlyMaintenances: Array<{month: string; count: number}>;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-maintenances/stats`);
    if (!response.ok) {
      throw new Error('Bakım istatistikleri getirilemedi');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching maintenance stats:', error);
    throw error;
  }
};

// Makinenin son bakımunu getir
export const getLastMachineMaintenance = async (machineId: number): Promise<MachineMaintenance | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-maintenances/machine/${machineId}/last`);
    if (!response.ok) {
      throw new Error('Son bakım kaydı getirilemedi');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching last maintenance:', error);
    throw error;
  }
};

// Bakım geçmişi raporu getir
export const getMachineMaintenanceHistory = async (machineId?: number, orgId?: number, limit: number = 100): Promise<MachineMaintenance[]> => {
  try {
    const params = new URLSearchParams();
    if (machineId) params.append('machineId', machineId.toString());
    if (orgId) params.append('orgId', orgId.toString());
    params.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/machine-maintenances/history?${params}`);
    if (!response.ok) {
      throw new Error('Bakım geçmişi getirilemedi');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching maintenance history:', error);
    throw error;
  }
};

// Belirli bir bakım kaydını getir
export const getMachineMaintenanceById = async (id: number): Promise<MachineMaintenance> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-maintenances/${id}`);
    if (!response.ok) {
      throw new Error('Bakım kaydı getirilemedi');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching maintenance:', error);
    throw error;
  }
};

// Yeni bakım kaydı oluştur
export const createMachineMaintenance = async (maintenanceData: MachineMaintenanceInput): Promise<MachineMaintenance> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-maintenances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(maintenanceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Bakım kaydı oluşturulamadı');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating maintenance:', error);
    throw error;
  }
};

// Makine bakımı yap (özel endpoint)
export const maintainMachine = async (
  machineId: number,
  maintenanceData: Omit<MachineMaintenanceInput, 'machine_id'>
): Promise<MachineMaintenance> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-maintenances/maintain/${machineId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        maintenance_org_id: maintenanceData.maintenance_org_id,
        maintained_by: maintenanceData.maintained_by,
        notes: maintenanceData.notes,
        maintenance_date: maintenanceData.maintenance_date
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Makine bakımı yapılamadı');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error maintaining machine:', error);
    throw error;
  }
};

// Bakım kaydını güncelle
export const updateMachineMaintenance = async (
  id: number, 
  maintenanceData: Partial<MachineMaintenanceInput>
): Promise<MachineMaintenance> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-maintenances/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(maintenanceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Bakım kaydı güncellenemedi');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating maintenance:', error);
    throw error;
  }
};

// Bakım kaydını sil
export const deleteMachineMaintenance = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-maintenances/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Bakım kaydı silinemedi');
    }
  } catch (error) {
    console.error('Error deleting maintenance:', error);
    throw error;
  }
};