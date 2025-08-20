import { MachineRepository } from '../repos/machine.repo';

export interface CalibrationAlert {
  id: number;
  serial_no: string;
  equipment_name: string;
  brand?: string;
  model?: string;
  last_calibration_date: string;
  next_calibration_date: string;
  calibration_org_name?: string;
  calibration_contact_name?: string;
  calibration_email?: string;
  calibration_phone?: string;
  days_overdue?: number;
  days_remaining?: number;
  status: 'expired' | 'expiring_soon';
  priority: 'critical' | 'warning';
}

export interface AlertSummary {
  totalExpired: number;
  totalExpiringSoon: number;
  alerts: CalibrationAlert[];
  hasAlerts: boolean;
}

export class AlertService {
  constructor(private machineRepo: MachineRepository) {}

  async getCalibrationAlerts(): Promise<AlertSummary> {
    try {
      const alertData = await this.machineRepo.getCalibrationAlerts();
      
      const alerts: CalibrationAlert[] = [];

      // Süresi geçenleri ekle (Kritik)
      alertData.expired.forEach((machine: any) => {
        alerts.push({
          id: machine.id,
          serial_no: machine.serial_no,
          equipment_name: machine.equipment_name,
          brand: machine.brand,
          model: machine.model,
          last_calibration_date: machine.last_calibration_date,
          next_calibration_date: machine.next_calibration_date,
          calibration_org_name: machine.calibration_org_name,
          calibration_contact_name: machine.calibration_contact_name,
          calibration_email: machine.calibration_email,
          calibration_phone: machine.calibration_phone,
          days_overdue: machine.days_overdue,
          status: 'expired',
          priority: 'critical'
        });
      });

      // 30 gün içinde dolacakları ekle (Uyarı)
      alertData.expiringSoon.forEach((machine: any) => {
        alerts.push({
          id: machine.id,
          serial_no: machine.serial_no,
          equipment_name: machine.equipment_name,
          brand: machine.brand,
          model: machine.model,
          last_calibration_date: machine.last_calibration_date,
          next_calibration_date: machine.next_calibration_date,
          calibration_org_name: machine.calibration_org_name,
          calibration_contact_name: machine.calibration_contact_name,
          calibration_email: machine.calibration_email,
          calibration_phone: machine.calibration_phone,
          days_remaining: machine.days_remaining,
          status: 'expiring_soon',
          priority: 'warning'
        });
      });

      // Öncelik sırasına göre sırala (kritik önce)
      alerts.sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority === 'critical' ? -1 : 1;
        }
        // Aynı priority'de ise tarihe göre sırala
        if (a.status === 'expired' && b.status === 'expired') {
          return (b.days_overdue || 0) - (a.days_overdue || 0);
        }
        if (a.status === 'expiring_soon' && b.status === 'expiring_soon') {
          return (a.days_remaining || 0) - (b.days_remaining || 0);
        }
        return 0;
      });

      return {
        totalExpired: alertData.totalExpired,
        totalExpiringSoon: alertData.totalExpiringSoon,
        alerts,
        hasAlerts: alerts.length > 0
      };
    } catch (error) {
      console.error('Error in AlertService.getCalibrationAlerts:', error);
      throw error;
    }
  }

  // Sadece özet bilgi için (performanslı)
  async getAlertSummary(): Promise<{ totalExpired: number; totalExpiringSoon: number; hasAlerts: boolean }> {
    try {
      const alertData = await this.machineRepo.getCalibrationAlerts();
      
      return {
        totalExpired: alertData.totalExpired,
        totalExpiringSoon: alertData.totalExpiringSoon,
        hasAlerts: (alertData.totalExpired + alertData.totalExpiringSoon) > 0
      };
    } catch (error) {
      console.error('Error in AlertService.getAlertSummary:', error);
      throw error;
    }
  }
}
