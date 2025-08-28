import { MachineMaintenanceRepository, MachineMaintenance, MachineMaintenanceInput } from '../repos/machineMaintenance.repo';

export class MachineMaintenanceService {
  constructor(private repo: MachineMaintenanceRepository) {}

  async getAllMaintenances(): Promise<MachineMaintenance[]> {
    try {
      return await this.repo.findAll();
    } catch (error) {
      console.error('Error fetching machine maintenances:', error);
      throw new Error('Bakım kayıtları getirilemedi');
    }
  }

  async getMaintenanceById(id: number): Promise<MachineMaintenance> {
    try {
      const maintenance = await this.repo.findById(id);
      if (!maintenance) {
        throw new Error('Bakım kaydı bulunamadı');
      }
      return maintenance;
    } catch (error) {
      console.error('Error fetching maintenance:', error);
      throw error;
    }
  }

  async getMaintenancesByMachine(machineId: number): Promise<MachineMaintenance[]> {
    try {
      if (!machineId || machineId <= 0) {
        throw new Error('Geçersiz makine ID');
      }
      return await this.repo.findByMachineId(machineId);
    } catch (error) {
      console.error('Error fetching maintenances by machine:', error);
      throw error;
    }
  }

  async getMaintenancesByOrg(orgId: number): Promise<MachineMaintenance[]> {
    try {
      if (!orgId || orgId <= 0) {
        throw new Error('Geçersiz kuruluş ID');
      }
      return await this.repo.findByMaintenanceOrgId(orgId);
    } catch (error) {
      console.error('Error fetching maintenances by org:', error);
      throw error;
    }
  }

  async createMaintenance(data: MachineMaintenanceInput): Promise<MachineMaintenance> {
    try {
      if (!data.machine_id || data.machine_id <= 0) {
        throw new Error('Makine seçiniz');
      }
      if (!data.maintenance_org_id || data.maintenance_org_id <= 0) {
        throw new Error('Bakım kuruluşu seçiniz');
      }
      if (!data.maintenance_date) {
        throw new Error('Bakım tarihi gereklidir');
      }
      if (!data.maintained_by || data.maintained_by.trim() === '') {
        throw new Error('Bakımı yapan kişi gereklidir');
      }

      const maintenanceDate = new Date(data.maintenance_date);
      const today = new Date();
      if (maintenanceDate > today) {
        throw new Error('Bakım tarihi gelecekte olamaz');
      }
      const tenYearsAgo = new Date();
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
      if (maintenanceDate < tenYearsAgo) {
        throw new Error('Bakım tarihi 10 yıldan eski olamaz');
      }

      return await this.repo.create(data);
    } catch (error) {
      console.error('Error creating maintenance:', error);
      throw error;
    }
  }

  async updateMaintenance(id: number, data: Partial<MachineMaintenanceInput>): Promise<MachineMaintenance> {
    try {
      if (data.machine_id !== undefined && (!data.machine_id || data.machine_id <= 0)) {
        throw new Error('Geçersiz makine ID');
      }
      if (data.maintenance_org_id !== undefined && (!data.maintenance_org_id || data.maintenance_org_id <= 0)) {
        throw new Error('Geçersiz kuruluş ID');
      }
      if (data.maintenance_date) {
        const maintenanceDate = new Date(data.maintenance_date);
        const today = new Date();
        if (maintenanceDate > today) {
          throw new Error('Bakım tarihi gelecekte olamaz');
        }
        const tenYearsAgo = new Date();
        tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
        if (maintenanceDate < tenYearsAgo) {
          throw new Error('Bakım tarihi 10 yıldan eski olamaz');
        }
      }

      const updated = await this.repo.update(id, data);
      if (!updated) {
        throw new Error('Bakım kaydı bulunamadı');
      }
      return updated;
    } catch (error) {
      console.error('Error updating maintenance:', error);
      throw error;
    }
  }

  async deleteMaintenance(id: number): Promise<void> {
    try {
      const deleted = await this.repo.delete(id);
      if (!deleted) {
        throw new Error('Bakım kaydı bulunamadı');
      }
    } catch (error) {
      console.error('Error deleting maintenance:', error);
      throw error;
    }
  }

  async getMaintenancesByDateRange(startDate: string, endDate: string): Promise<MachineMaintenance[]> {
    try {
      if (!startDate || !endDate) {
        throw new Error('Başlangıç ve bitiş tarihleri gereklidir');
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        throw new Error('Başlangıç tarihi bitiş tarihinden sonra olamaz');
      }
      const oneYearLater = new Date(start);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      if (end > oneYearLater) {
        throw new Error('Tarih aralığı 1 yıldan fazla olamaz');
      }
      return await this.repo.findByDateRange(startDate, endDate);
    } catch (error) {
      console.error('Error fetching maintenances by date range:', error);
      throw error;
    }
  }

  async getMaintenanceStats() {
    try {
      return await this.repo.getMaintenanceStats();
    } catch (error) {
      console.error('Error fetching maintenance stats:', error);
      throw new Error('Bakım istatistikleri getirilemedi');
    }
  }

  async getLastMaintenanceByMachine(machineId: number): Promise<MachineMaintenance | null> {
    try {
      if (!machineId || machineId <= 0) {
        throw new Error('Geçersiz makine ID');
      }
      return await this.repo.getLastMaintenanceByMachine(machineId);
    } catch (error) {
      console.error('Error fetching last maintenance:', error);
      throw error;
    }
  }

  async maintainMachine(machineId: number, data: Omit<MachineMaintenanceInput, 'machine_id'>): Promise<MachineMaintenance> {
    try {
      const fullData: MachineMaintenanceInput = { machine_id: machineId, ...data };
      return await this.createMaintenance(fullData);
    } catch (error) {
      console.error('Error maintaining machine:', error);
      throw error;
    }
  }

  async getMaintenanceHistory(machineId?: number, orgId?: number, limit: number = 100): Promise<MachineMaintenance[]> {
    try {
      if (limit > 1000) {
        throw new Error('Maksimum 1000 kayıt getirilebilir');
      }
      if (machineId && machineId > 0) {
        return await this.repo.findByMachineId(machineId);
      }
      if (orgId && orgId > 0) {
        return await this.repo.findByMaintenanceOrgId(orgId);
      }
      return await this.repo.findAll();
    } catch (error) {
      console.error('Error fetching maintenance history:', error);
      throw error;
    }
  }
}