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
      throw new Error('Experiment type name is required');
    }
    if (data.base_price < 0) {
      throw new Error('Base price cannot be negative');
    }
    if (data.accredited_multiplier < 0) {
      throw new Error('Accredited multiplier cannot be negative');
    }

    return await this.repo.create(data);
  }

  async updateExperimentType(id: number, data: { name: string; base_price: number; accredited_multiplier: number }) {
    // Business logic validations
    if (!data.name?.trim()) {
      throw new Error('Experiment type name is required');
    }
    if (data.base_price < 0) {
      throw new Error('Base price cannot be negative');
    }
    if (data.accredited_multiplier < 0) {
      throw new Error('Accredited multiplier cannot be negative');
    }

    const result = await this.repo.update(id, data);
    if (!result) {
      throw new Error('Experiment type not found');
    }
    return result;
  }

  async deleteExperimentType(id: number) {
    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new Error('Experiment type not found');
    }
    return { success: true };
  }
}
