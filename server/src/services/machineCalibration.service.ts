import { MachineCalibrationRepository, MachineCalibration, MachineCalibrationInput } from '../repos/machineCalibration.repo';

export class MachineCalibrationService {
  constructor(private machineCalibrationRepo: MachineCalibrationRepository) {}

  async getAllCalibrations(): Promise<MachineCalibration[]> {
    try {
      return await this.machineCalibrationRepo.findAll();
    } catch (error) {
      console.error('Error fetching machine calibrations:', error);
      throw new Error('Kalibrasyon kayıtları getirilemedi');
    }
  }

  async getCalibrationById(id: number): Promise<MachineCalibration> {
    try {
      const calibration = await this.machineCalibrationRepo.findById(id);
      if (!calibration) {
        throw new Error('Kalibrasyon kaydı bulunamadı');
      }
      return calibration;
    } catch (error) {
      console.error('Error fetching calibration:', error);
      throw error;
    }
  }

  async getCalibrationsByMachine(machineId: number): Promise<MachineCalibration[]> {
    try {
      if (!machineId || machineId <= 0) {
        throw new Error('Geçersiz makine ID');
      }
      return await this.machineCalibrationRepo.findByMachineId(machineId);
    } catch (error) {
      console.error('Error fetching calibrations by machine:', error);
      throw error;
    }
  }

  async getCalibrationsByOrg(orgId: number): Promise<MachineCalibration[]> {
    try {
      if (!orgId || orgId <= 0) {
        throw new Error('Geçersiz kuruluş ID');
      }
      return await this.machineCalibrationRepo.findByCalibrationOrgId(orgId);
    } catch (error) {
      console.error('Error fetching calibrations by org:', error);
      throw error;
    }
  }

  async createCalibration(calibrationData: MachineCalibrationInput): Promise<MachineCalibration> {
    try {
      // Validation
      if (!calibrationData.machine_id || calibrationData.machine_id <= 0) {
        throw new Error('Makine seçiniz');
      }

      if (!calibrationData.calibration_org_id || calibrationData.calibration_org_id <= 0) {
        throw new Error('Kalibrasyon kuruluşu seçiniz');
      }

      if (!calibrationData.calibration_date) {
        throw new Error('Kalibrasyon tarihi gereklidir');
      }

      if (!calibrationData.calibrated_by || calibrationData.calibrated_by.trim() === '') {
        throw new Error('Kalibre eden kişi gereklidir');
      }

      // Tarih kontrolü
      const calibrationDate = new Date(calibrationData.calibration_date);
      const today = new Date();
      
      if (calibrationDate > today) {
        throw new Error('Kalibrasyon tarihi gelecekte olamaz');
      }

      // 10 yıldan eski olamaz
      const tenYearsAgo = new Date();
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
      
      if (calibrationDate < tenYearsAgo) {
        throw new Error('Kalibrasyon tarihi 10 yıldan eski olamaz');
      }

      return await this.machineCalibrationRepo.create(calibrationData);
    } catch (error) {
      console.error('Error creating calibration:', error);
      throw error;
    }
  }

  async updateCalibration(id: number, calibrationData: Partial<MachineCalibrationInput>): Promise<MachineCalibration> {
    try {
      // Validation
      if (calibrationData.machine_id !== undefined && (!calibrationData.machine_id || calibrationData.machine_id <= 0)) {
        throw new Error('Geçersiz makine ID');
      }

      if (calibrationData.calibration_org_id !== undefined && (!calibrationData.calibration_org_id || calibrationData.calibration_org_id <= 0)) {
        throw new Error('Geçersiz kuruluş ID');
      }

      if (calibrationData.calibration_date) {
        const calibrationDate = new Date(calibrationData.calibration_date);
        const today = new Date();
        
        if (calibrationDate > today) {
          throw new Error('Kalibrasyon tarihi gelecekte olamaz');
        }

        const tenYearsAgo = new Date();
        tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
        
        if (calibrationDate < tenYearsAgo) {
          throw new Error('Kalibrasyon tarihi 10 yıldan eski olamaz');
        }
      }

      const updatedCalibration = await this.machineCalibrationRepo.update(id, calibrationData);
      if (!updatedCalibration) {
        throw new Error('Kalibrasyon kaydı bulunamadı');
      }
      return updatedCalibration;
    } catch (error) {
      console.error('Error updating calibration:', error);
      throw error;
    }
  }

  async deleteCalibration(id: number): Promise<void> {
    try {
      const deleted = await this.machineCalibrationRepo.delete(id);
      if (!deleted) {
        throw new Error('Kalibrasyon kaydı bulunamadı');
      }
    } catch (error) {
      console.error('Error deleting calibration:', error);
      throw error;
    }
  }

  async getCalibrationsByDateRange(startDate: string, endDate: string): Promise<MachineCalibration[]> {
    try {
      if (!startDate || !endDate) {
        throw new Error('Başlangıç ve bitiş tarihleri gereklidir');
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start > end) {
        throw new Error('Başlangıç tarihi bitiş tarihinden sonra olamaz');
      }

      // Maksimum 1 yıl aralık
      const oneYearLater = new Date(start);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      
      if (end > oneYearLater) {
        throw new Error('Tarih aralığı 1 yıldan fazla olamaz');
      }

      return await this.machineCalibrationRepo.findByDateRange(startDate, endDate);
    } catch (error) {
      console.error('Error fetching calibrations by date range:', error);
      throw error;
    }
  }

  async getCalibrationStats(): Promise<{
    totalCalibrations: number;
    thisMonthCalibrations: number;
    thisYearCalibrations: number;
    topCalibrationOrgs: Array<{org_name: string; count: number}>;
    monthlyCalibrations: Array<{month: string; count: number}>;
  }> {
    try {
      return await this.machineCalibrationRepo.getCalibrationStats();
    } catch (error) {
      console.error('Error fetching calibration stats:', error);
      throw new Error('Kalibrasyon istatistikleri getirilemedi');
    }
  }

  async getLastCalibrationByMachine(machineId: number): Promise<MachineCalibration | null> {
    try {
      if (!machineId || machineId <= 0) {
        throw new Error('Geçersiz makine ID');
      }
      return await this.machineCalibrationRepo.getLastCalibrationByMachine(machineId);
    } catch (error) {
      console.error('Error fetching last calibration:', error);
      throw error;
    }
  }

  // Makine kalibre et - yeni kalibrasyon kaydı oluştur ve makinenin son kalibrasyon tarihini güncelle
  async calibrateMachine(machineId: number, calibrationData: Omit<MachineCalibrationInput, 'machine_id'>): Promise<MachineCalibration> {
    try {
      const fullCalibrationData: MachineCalibrationInput = {
        machine_id: machineId,
        ...calibrationData
      };

      return await this.createCalibration(fullCalibrationData);
    } catch (error) {
      console.error('Error calibrating machine:', error);
      throw error;
    }
  }

  // Kalibrasyon geçmişi raporu
  async getCalibrationHistory(machineId?: number, orgId?: number, limit: number = 100): Promise<MachineCalibration[]> {
    try {
      if (limit > 1000) {
        throw new Error('Maksimum 1000 kayıt getirilebilir');
      }

      if (machineId && machineId > 0) {
        return await this.machineCalibrationRepo.findByMachineId(machineId);
      }

      if (orgId && orgId > 0) {
        return await this.machineCalibrationRepo.findByCalibrationOrgId(orgId);
      }

      return await this.machineCalibrationRepo.findAll();
    } catch (error) {
      console.error('Error fetching calibration history:', error);
      throw error;
    }
  }
}
