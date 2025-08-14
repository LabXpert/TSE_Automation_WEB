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
  },

  // Yeni deney türü ekle
  async create(typeData: {
    name: string;
    description?: string;
    price?: number;
    duration?: number;
    category?: string;
  }) {
    try {
      const { name, description, price, duration, category } = typeData;
      
      const result = await pool.query(
        'INSERT INTO experiment_types (name, description, price, duration, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description, price, duration, category]
      );
      
      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      console.error('ExperimentType create error:', error);
      return {
        success: false,
        error: 'Deney türü eklenirken hata oluştu'
      };
    }
  },

  // Deney türü güncelle
  async update(id: string, typeData: {
    name?: string;
    description?: string;
    price?: number;
    duration?: number;
    category?: string;
  }) {
    try {
      const { name, description, price, duration, category } = typeData;
      
      const result = await pool.query(
        'UPDATE experiment_types SET name = COALESCE($1, name), description = COALESCE($2, description), price = COALESCE($3, price), duration = COALESCE($4, duration), category = COALESCE($5, category), updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
        [name, description, price, duration, category, id]
      );
      
      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      console.error('ExperimentType update error:', error);
      return {
        success: false,
        error: 'Deney türü güncellenirken hata oluştu'
      };
    }
  },

  // Deney türü sil
  async delete(id: string) {
    try {
      await pool.query('DELETE FROM experiment_types WHERE id = $1', [id]);
      return {
        success: true,
        data: null
      };
    } catch (error) {
      console.error('ExperimentType delete error:', error);
      return {
        success: false,
        error: 'Deney türü silinirken hata oluştu'
      };
    }
  }
};