import { CompanyRepository, CompanyData } from '../repos/company.repo';

export class CompanyService {
  private repo = new CompanyRepository();

  async getAllCompanies() {
    return await this.repo.findAll();
  }

  async getCompanyById(id: number) {
    return await this.repo.findById(id);
  }

  async createCompany(data: CompanyData) {
    // Business logic validations
    this.validateCompanyData(data);

    return await this.repo.create(data);
  }

  async updateCompany(id: number, data: CompanyData) {
    // Business logic validations
    this.validateCompanyData(data);

    const result = await this.repo.update(id, data);
    if (!result) {
      throw new Error('Company not found');
    }
    return result;
  }

  async deleteCompany(id: number) {
    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new Error('Company not found');
    }
    return { success: true };
  }

  private validateCompanyData(data: CompanyData) {
    if (!data.name?.trim()) {
      throw new Error('Company name is required');
    }
    if (!data.tax_no?.trim()) {
      throw new Error('Tax number is required');
    }
    if (!data.contact_name?.trim()) {
      throw new Error('Contact name is required');
    }
    if (!data.address?.trim()) {
      throw new Error('Address is required');
    }
    if (!data.phone?.trim()) {
      throw new Error('Phone is required');
    }
    if (!data.email?.trim()) {
      throw new Error('Email is required');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }
  }
}
