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

    try {
      return await this.repo.create(data);
    } catch (error: any) {
      console.error('Database error in createCompany:', error);
      
      // PostgreSQL unique constraint violation
      if (error.code === '23505' && error.constraint === 'companies_tax_no_key') {
        throw new Error('Bu vergi numarası ile zaten kayıtlı bir firma bulunmaktadır');
      }
      
      // Generic database error
      throw new Error('Firma kaydedilirken veritabanı hatası oluştu: ' + error.message);
    }
  }

  async updateCompany(id: number, data: CompanyData) {
    // Business logic validations
    this.validateCompanyData(data);

    const result = await this.repo.update(id, data);
    if (!result) {
      throw new Error('Firma bulunamadı');
    }
    return result;
  }

  async deleteCompany(id: number) {
    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new Error('Firma bulunamadı');
    }
    return { success: true };
  }

  private validateCompanyData(data: CompanyData) {
    if (!data.name?.trim()) {
      throw new Error('Firma adı gereklidir');
    }
    if (!data.tax_no?.trim()) {
      throw new Error('Vergi numarası gereklidir');
    }
    
    // Vergi numarası benzersizlik kontrolü için boşluk karakterlerini temizle
    data.tax_no = data.tax_no.trim();
    
    if (!data.contact_name?.trim()) {
      throw new Error('İletişim adı gereklidir');
    }
    if (!data.address?.trim()) {
      throw new Error('Adres gereklidir');
    }
    if (!data.phone?.trim()) {
      throw new Error('Telefon gereklidir');
    }
    if (!data.email?.trim()) {
      throw new Error('Email gereklidir');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Geçersiz email formatı');
    }
  }
}
