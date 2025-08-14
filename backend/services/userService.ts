// backend/services/userService.ts
import { pool } from '../db.ts';

export const userService = {
  // Tüm kullanıcıları getir
  async getAll() {
    try {
      const result = await pool.query('SELECT * FROM users ORDER BY id');
      return {
        success: true,
        data: result.rows
      };
    } catch (error) {
      console.error('User getAll error:', error);
      return {
        success: false,
        error: 'Kullanıcılar alınırken hata oluştu'
      };
    }
  },

  // ID'ye göre kullanıcı getir
  async getById(id: string) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return {
        success: true,
        data: result.rows[0] || null
      };
    } catch (error) {
      console.error('User getById error:', error);
      return {
        success: false,
        error: 'Kullanıcı bulunamadı'
      };
    }
  }
};