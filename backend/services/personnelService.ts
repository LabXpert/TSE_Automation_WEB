// backend/services/personnelService.ts
import { pool } from '../db.ts';

export const personnelService = {
  // Tüm personelleri getir
  async getAll() {
    try {
      const result = await pool.query('SELECT * FROM personnel ORDER BY id');
      return {
        success: true,
        data: result.rows
      };
    } catch (error) {
      console.error('Personnel getAll error:', error);
      return {
        success: false,
        error: 'Personeller alınırken hata oluştu'
      };
    }
  },

  // ID'ye göre personel getir
  async getById(id: string) {
    try {
      const result = await pool.query('SELECT * FROM personnel WHERE id = $1', [id]);
      return {
        success: true,
        data: result.rows[0] || null
      };
    } catch (error) {
      console.error('Personnel getById error:', error);
      return {
        success: false,
        error: 'Personel bulunamadı'
      };
    }
  }
};