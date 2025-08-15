import { ExperimentTypeRepository } from '../repos/experimentType.repo';

export class ExperimentTypeService {
  private repo = new ExperimentTypeRepository();

  async getAllExperimentTypes() {
    return await this.repo.findAll();
  }

  async getExperimentTypeById(id: number) {
    return await this.repo.findById(id);
  }

  async createExperimentType(data: { name: string; base_price: number; accredited_multiplier: number }) {
    // Business logic validations
    if (!data.name?.trim()) {
      throw new Error('Deney türü adı gereklidir');
    }
    if (data.base_price < 0) {
      throw new Error('Temel fiyat negatif olamaz');
    }
    if (data.accredited_multiplier < 0) {
      throw new Error('Akredite çarpanı negatif olamaz');
    }

    return await this.repo.create(data);
  }

  async updateExperimentType(id: number, data: { name: string; base_price: number; accredited_multiplier: number }) {
    // Business logic validations
    if (!data.name?.trim()) {
      throw new Error('Deney türü adı gereklidir');
    }
    if (data.base_price < 0) {
      throw new Error('Temel fiyat negatif olamaz');
    }
    if (data.accredited_multiplier < 0) {
      throw new Error('Akredite çarpanı negatif olamaz');
    }

    const result = await this.repo.update(id, data);
    if (!result) {
      throw new Error('Deney türü bulunamadı');
    }
    return result;
  }

  async deleteExperimentType(id: number) {
    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new Error('Deney türü bulunamadı');
    }
    return { success: true };
  }
}
