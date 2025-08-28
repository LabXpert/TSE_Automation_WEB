import {
  MaintenanceOrgRepository,
  MaintenanceOrg,
  MaintenanceOrgInput,
} from '../repos/maintenanceOrg.repo';

export class MaintenanceOrgService {
  constructor(private maintenanceOrgRepo: MaintenanceOrgRepository) {}

  async getAllOrgs(): Promise<MaintenanceOrg[]> {
    try {
      return await this.maintenanceOrgRepo.findAll();
    } catch (error) {
      console.error('Error fetching maintenance organizations:', error);
      throw new Error('Bakım kuruluşları getirilemedi');
    }
  }

  async getOrgById(id: number): Promise<MaintenanceOrg> {
    try {
      const org = await this.maintenanceOrgRepo.findById(id);
      if (!org) {
        throw new Error('Bakım kuruluşu bulunamadı');
      }
      return org;
    } catch (error) {
      console.error('Error fetching maintenance organization:', error);
      throw error;
    }
  }

  async createOrg(orgData: MaintenanceOrgInput): Promise<MaintenanceOrg> {
    try {
      // Validation (kalibrasyon servisindekiyle aynı mantık)
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

      return await this.maintenanceOrgRepo.create(orgData);
    } catch (error) {
      console.error('Error creating maintenance organization:', error);
      throw error;
    }
  }

  async updateOrg(id: number, orgData: Partial<MaintenanceOrgInput>): Promise<MaintenanceOrg> {
    try {
      // Validation (kalibrasyon servisindeki pattern ile)
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

      const updatedOrg = await this.maintenanceOrgRepo.update(id, orgData);
      if (!updatedOrg) {
        throw new Error('Bakım kuruluşu bulunamadı');
      }
      return updatedOrg;
    } catch (error) {
      console.error('Error updating maintenance organization:', error);
      throw error;
    }
  }

  async deleteOrg(id: number): Promise<void> {
    try {
      const deleted = await this.maintenanceOrgRepo.delete(id);
      if (!deleted) {
        throw new Error('Bakım kuruluşu bulunamadı');
      }
    } catch (error) {
      console.error('Error deleting maintenance organization:', error);
      throw error;
    }
  }

  async searchOrgs(searchTerm: string): Promise<MaintenanceOrg[]> {
    try {
      if (!searchTerm?.trim()) {
        return await this.getAllOrgs();
      }
      return await this.maintenanceOrgRepo.search(searchTerm.trim());
    } catch (error) {
      console.error('Error searching maintenance organizations:', error);
      throw new Error('Arama sırasında hata oluştu');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
