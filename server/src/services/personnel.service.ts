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
      throw new Error('First name is required');
    }
    if (!data.last_name?.trim()) {
      throw new Error('Last name is required');
    }
    if (!data.title?.trim()) {
      throw new Error('Title is required');
    }

    return await this.repo.create(data);
  }

  async updatePersonnel(id: number, data: { first_name: string; last_name: string; title: string }) {
    // Business logic validations
    if (!data.first_name?.trim()) {
      throw new Error('First name is required');
    }
    if (!data.last_name?.trim()) {
      throw new Error('Last name is required');
    }
    if (!data.title?.trim()) {
      throw new Error('Title is required');
    }

    const result = await this.repo.update(id, data);
    if (!result) {
      throw new Error('Personnel not found');
    }
    return result;
  }

  async deletePersonnel(id: number) {
    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new Error('Personnel not found');
    }
    return { success: true };
  }
}
