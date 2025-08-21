import { CalibrationOrgRepository, CalibrationOrg, CalibrationOrgInput } from '../repos/calibrationOrg.repo';

export class CalibrationOrgService {
  constructor(private calibrationOrgRepo: CalibrationOrgRepository) {}

  async getAllOrgs(): Promise<CalibrationOrg[]> {
    try {
      return await this.calibrationOrgRepo.findAll();
    } catch (error) {
      console.error('Error fetching calibration organizations:', error);
      throw new Error('Kalibrasyon kuruluşları getirilemedi');
    }
  }

  async getOrgById(id: number): Promise<CalibrationOrg> {
    try {
      const org = await this.calibrationOrgRepo.findById(id);
      if (!org) {
        throw new Error('Kalibrasyon kuruluşu bulunamadı');
      }
      return org;
    } catch (error) {
      console.error('Error fetching calibration organization:', error);
      throw error;
    }
  }

  async createOrg(orgData: CalibrationOrgInput): Promise<CalibrationOrg> {
    try {
      // Validation
      if (!orgData.org_name?.trim()) {
        throw new Error('Kuruluş adı gereklidir');
      }

      if (!orgData.contact_name?.trim()) {
        throw new Error('İletişim kişisi gereklidir');
      }

      if (!orgData.phone?.trim()) {
        throw new Error('Telefon numarası gereklidir');
      }

      if (orgData.email && !this.isValidEmail(orgData.email)) {
        throw new Error('Geçerli bir e-posta adresi giriniz');
      }

      return await this.calibrationOrgRepo.create(orgData);
    } catch (error) {
      console.error('Error creating calibration organization:', error);
      throw error;
    }
  }

  async updateOrg(id: number, orgData: Partial<CalibrationOrgInput>): Promise<CalibrationOrg> {
    try {
      // Validation
      if (orgData.org_name !== undefined && !orgData.org_name?.trim()) {
        throw new Error('Kuruluş adı gereklidir');
      }

      if (orgData.contact_name !== undefined && !orgData.contact_name?.trim()) {
        throw new Error('İletişim kişisi gereklidir');
      }

      if (orgData.phone !== undefined && !orgData.phone?.trim()) {
        throw new Error('Telefon numarası gereklidir');
      }

      if (orgData.email && !this.isValidEmail(orgData.email)) {
        throw new Error('Geçerli bir e-posta adresi giriniz');
      }

      const updatedOrg = await this.calibrationOrgRepo.update(id, orgData);
      if (!updatedOrg) {
        throw new Error('Kalibrasyon kuruluşu bulunamadı');
      }
      return updatedOrg;
    } catch (error) {
      console.error('Error updating calibration organization:', error);
      throw error;
    }
  }

  async deleteOrg(id: number): Promise<void> {
    try {
      const deleted = await this.calibrationOrgRepo.delete(id);
      if (!deleted) {
        throw new Error('Kalibrasyon kuruluşu bulunamadı');
      }
    } catch (error) {
      console.error('Error deleting calibration organization:', error);
      throw error;
    }
  }

  async searchOrgs(searchTerm: string): Promise<CalibrationOrg[]> {
    try {
      if (!searchTerm?.trim()) {
        return await this.getAllOrgs();
      }
      return await this.calibrationOrgRepo.search(searchTerm.trim());
    } catch (error) {
      console.error('Error searching calibration organizations:', error);
      throw new Error('Arama sırasında hata oluştu');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
