import { PersonnelRepository } from '../repos/personnel.repo';

export class PersonnelService {
  private repo = new PersonnelRepository();

  async getAllPersonnel() {
    return await this.repo.findAll();
  }

  async getPersonnelById(id: number) {
    return await this.repo.findById(id);
  }

  async createPersonnel(data: { first_name: string; last_name: string; title: string }) {
    // Business logic validations
    if (!data.first_name?.trim()) {
      throw new Error('Ad gereklidir');
    }
    if (!data.last_name?.trim()) {
      throw new Error('Soyad gereklidir');
    }
    if (!data.title?.trim()) {
      throw new Error('Unvan gereklidir');
    }

    return await this.repo.create(data);
  }

  async updatePersonnel(id: number, data: { first_name: string; last_name: string; title: string }) {
    // Business logic validations
    if (!data.first_name?.trim()) {
      throw new Error('Ad gereklidir');
    }
    if (!data.last_name?.trim()) {
      throw new Error('Soyad gereklidir');
    }
    if (!data.title?.trim()) {
      throw new Error('Unvan gereklidir');
    }

    const result = await this.repo.update(id, data);
    if (!result) {
      throw new Error('Personel bulunamadı');
    }
    return result;
  }

  async deletePersonnel(id: number) {
    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new Error('Personel bulunamadı');
    }
    return { success: true };
  }
}
