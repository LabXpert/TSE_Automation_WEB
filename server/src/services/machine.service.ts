import { MachineRepository, Machine, MachineInput } from '../repos/machine.repo';

export class MachineService {
  constructor(private machineRepo: MachineRepository) {}

  async getAllMachines(): Promise<Machine[]> {
    try {
      const machines = await this.machineRepo.findAll();
      return machines;
    } catch (error) {
      console.error('Error fetching machines:', error);
      // Hata durumunda boş array döndür
      return [];
    }
  }

  async getMachineById(id: number): Promise<Machine> {
    try {
      const machine = await this.machineRepo.findById(id);
      if (!machine) {
        throw new Error('Makine bulunamadı');
      }
      return machine;
    } catch (error) {
      console.error('Error fetching machine:', error);
      throw error;
    }
  }

  async createMachine(machineData: MachineInput): Promise<Machine> {
    try {
      // Validation
      if (!machineData.serial_no?.trim()) {
        throw new Error('Seri numarası gereklidir');
      }

      if (!machineData.equipment_name?.trim()) {
        throw new Error('Ekipman adı gereklidir');
      }

      if (!machineData.last_calibration_date) {
        throw new Error('Son kalibrasyon tarihi gereklidir');
      }

      if (!machineData.calibration_org_id) {
        throw new Error('Kalibrasyon kuruluşu seçiniz');
      }

      if (!machineData.calibration_interval || machineData.calibration_interval < 1) {
        throw new Error('Kalibrasyon aralığı en az 1 yıl olmalıdır');
      }

      // Tarih kontrolü
      const calibrationDate = new Date(machineData.last_calibration_date);
      const today = new Date();
      if (calibrationDate > today) {
        throw new Error('Kalibrasyon tarihi gelecekte olamaz');
      }

      return await this.machineRepo.create(machineData);
    } catch (error) {
      console.error('Error creating machine:', error);
      throw error;
    }
  }

  async updateMachine(id: number, machineData: Partial<MachineInput>): Promise<Machine> {
    try {
      // Validation
      if (machineData.serial_no !== undefined && !machineData.serial_no?.trim()) {
        throw new Error('Seri numarası gereklidir');
      }

      if (machineData.equipment_name !== undefined && !machineData.equipment_name?.trim()) {
        throw new Error('Ekipman adı gereklidir');
      }

      if (machineData.calibration_interval !== undefined && (machineData.calibration_interval < 1)) {
        throw new Error('Kalibrasyon aralığı en az 1 yıl olmalıdır');
      }

      if (machineData.last_calibration_date) {
        const calibrationDate = new Date(machineData.last_calibration_date);
        const today = new Date();
        if (calibrationDate > today) {
          throw new Error('Kalibrasyon tarihi gelecekte olamaz');
        }
      }

      const updatedMachine = await this.machineRepo.update(id, machineData);
      if (!updatedMachine) {
        throw new Error('Makine bulunamadı');
      }
      return updatedMachine;
    } catch (error) {
      console.error('Error updating machine:', error);
      throw error;
    }
  }

  async deleteMachine(id: number): Promise<void> {
    try {
      const deleted = await this.machineRepo.delete(id);
      if (!deleted) {
        throw new Error('Makine bulunamadı');
      }
    } catch (error) {
      console.error('Error deleting machine:', error);
      throw error;
    }
  }

  async searchMachines(searchTerm: string): Promise<Machine[]> {
    try {
      if (!searchTerm?.trim()) {
        return await this.getAllMachines();
      }
      return await this.machineRepo.search(searchTerm.trim());
    } catch (error) {
      console.error('Error searching machines:', error);
      throw new Error('Arama sırasında hata oluştu');
    }
  }

  async getMachinesByCalibrationOrg(orgId: number): Promise<Machine[]> {
    try {
      return await this.machineRepo.findByCalibrationOrg(orgId);
    } catch (error) {
      console.error('Error fetching machines by calibration org:', error);
      throw new Error('Kuruluşa ait makineler getirilemedi');
    }
  }

  async getExpiringCalibrations(days: number = 30): Promise<Machine[]> {
    try {
      if (days < 0 || days > 365) {
        throw new Error('Gün sayısı 0-365 arasında olmalıdır');
      }
      return await this.machineRepo.findExpiringCalibrations(days);
    } catch (error) {
      console.error('Error fetching expiring calibrations:', error);
      throw new Error('Süresi dolacak kalibrasyonlar getirilemedi');
    }
  }

  async updateCalibrationDate(id: number, calibrationDate: string): Promise<Machine> {
    try {
      // Tarih kontrolü
      const calibrationDateObj = new Date(calibrationDate);
      const today = new Date();
      
      if (calibrationDateObj > today) {
        throw new Error('Kalibrasyon tarihi gelecekte olamaz');
      }

      const updatedMachine = await this.machineRepo.updateCalibrationDate(id, calibrationDate);
      if (!updatedMachine) {
        throw new Error('Makine bulunamadı');
      }
      return updatedMachine;
    } catch (error) {
      console.error('Error updating calibration date:', error);
      throw error;
    }
  }

  async getCalibrationStats(): Promise<{
    total: number;
    expiring30Days: number;
    expiring60Days: number;
    expiring90Days: number;
  }> {
    try {
      const [total, expiring30, expiring60, expiring90] = await Promise.all([
        this.machineRepo.findAll(),
        this.machineRepo.findExpiringCalibrations(30),
        this.machineRepo.findExpiringCalibrations(60),
        this.machineRepo.findExpiringCalibrations(90)
      ]);

      return {
        total: total.length,
        expiring30Days: expiring30.length,
        expiring60Days: expiring60.length,
        expiring90Days: expiring90.length
      };
    } catch (error) {
      console.error('Error fetching calibration stats:', error);
      throw new Error('Kalibrasyon istatistikleri getirilemedi');
    }
  }
}
