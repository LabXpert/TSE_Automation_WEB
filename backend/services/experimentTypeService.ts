// backend/services/experimentTypeService.ts
import { pool } from '../db.ts';

export const experimentTypeService = {
  // Tüm deney türlerini getir
  async getAll() {
    try {
      const result = await pool.query('SELECT * FROM experiment_types ORDER BY id');
      return {
        success: true,
        data: result.rows
      };
    } catch (error) {
      console.error('ExperimentType getAll error:', error);
      return {
        success: false,
        error: 'Deney türleri alınırken hata oluştu'
      };
    }
  },

  // ID'ye göre deney türü getir
  async getById(id: string) {
    try {
      const result = await pool.query('SELECT * FROM experiment_types WHERE id = $1', [id]);
      return {
        success: true,
        data: result.rows[0] || null
      };
    } catch (error) {
      console.error('ExperimentType getById error:', error);
      return {
        success: false,
        error: 'Deney türü bulunamadı'
      };
    }
  }
};