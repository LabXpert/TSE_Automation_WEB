import { ApplicationRepository, ApplicationData } from '../repos/application.repo';

export class ApplicationService {
  private repo = new ApplicationRepository();

  async getRecentApplications(limit: number = 5) {
    return await this.repo.findRecent(limit);
  }

  async getAllApplications() {
    return await this.repo.findAll();
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
      throw new Error('Application not found');
    }
    return result;
  }

  async deleteApplication(id: number) {
    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new Error('Application not found');
    }
    return { success: true };
  }

  private validateApplicationData(data: ApplicationData) {
    if (!data.company_id) {
      throw new Error('Company ID is required');
    }
    if (!data.application_no?.trim()) {
      throw new Error('Application number is required');
    }
    if (!data.application_date?.trim()) {
      throw new Error('Application date is required');
    }
    if (!data.certification_type?.trim()) {
      throw new Error('Certification type is required');
    }
    if (!Array.isArray(data.tests) || data.tests.length === 0) {
      throw new Error('At least one test is required');
    }

    // Validate each test
    data.tests.forEach((test, index) => {
      if (!test.experiment_type_id) {
        throw new Error(`Test ${index + 1}: Experiment type is required`);
      }
      if (!test.responsible_personnel_id) {
        throw new Error(`Test ${index + 1}: Responsible personnel is required`);
      }
      if (typeof test.unit_price !== 'number' || test.unit_price < 0) {
        throw new Error(`Test ${index + 1}: Valid unit price is required`);
      }
    });

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.application_date)) {
      throw new Error('Application date must be in YYYY-MM-DD format');
    }
  }
}
