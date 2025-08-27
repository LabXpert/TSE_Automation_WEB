import { ApplicationRepository, ApplicationData } from '../repos/application.repo';

export class ApplicationService {
  private repo = new ApplicationRepository();

  async getRecentApplications(limit: number = 5) {
    return await this.repo.findRecent(limit);
  }

  async getAllApplications() {
    return await this.repo.findAll();
  }

  async getLast7DaysApplications() {
    return await this.repo.findLast7Days();
  }

  async createApplication(data: ApplicationData) {
    // Business logic validations
    this.validateApplicationData(data);

    return await this.repo.create(data);
  }

  async updateApplication(id: number, data: ApplicationData) {
    // Business logic validations
    this.validateApplicationData(data);

    const result = await this.repo.update(id, data);
    if (!result) {
      throw new Error('Başvuru bulunamadı');
    }
    return result;
  }

  async deleteApplication(id: number) {
    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new Error('Başvuru bulunamadı');
    }
    return { success: true };
  }

  private validateApplicationData(data: ApplicationData) {
    if (!data.company_id) {
      throw new Error('Firma ID gereklidir');
    }
    if (!data.application_no?.trim()) {
      throw new Error('Başvuru numarası gereklidir');
    }
    if (!data.application_date?.trim()) {
      throw new Error('Başvuru tarihi gereklidir');
    }
    if (!data.certification_type?.trim()) {
      throw new Error('Sertifikasyon türü gereklidir');
    }
    if (!Array.isArray(data.tests) || data.tests.length === 0) {
      throw new Error('En az bir test gereklidir');
    }

    // Validate each test
    data.tests.forEach((test, index) => {
      if (!test.experiment_type_id) {
        throw new Error(`Test ${index + 1}: Deney türü gereklidir`);
      }
      if (!test.responsible_personnel_id) {
        throw new Error(`Test ${index + 1}: Sorumlu personel gereklidir`);
      }
      if (typeof test.unit_price !== 'number' || test.unit_price < 0) {
        throw new Error(`Test ${index + 1}: Geçerli birim fiyat gereklidir`);
      }
    });

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.application_date)) {
      throw new Error('Başvuru tarihi YYYY-MM-DD formatında olmalıdır');
    }
  }
}
