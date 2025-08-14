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
  },

  // Yeni personel ekle
  async create(personnelData: {
    name: string;
    surname: string;
    title?: string;
    department?: string;
    email?: string;
    phone?: string;
  }) {
    try {
      const { name, surname, title, department, email, phone } = personnelData;
      
      const result = await pool.query(
        'INSERT INTO personnel (name, surname, title, department, email, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, surname, title, department, email, phone]
      );
      
      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      console.error('Personnel create error:', error);
      return {
        success: false,
        error: 'Personel eklenirken hata oluştu'
      };
    }
  },

  // Personel güncelle
  async update(id: string, personnelData: {
    name?: string;
    surname?: string;
    title?: string;
    department?: string;
    email?: string;
    phone?: string;
  }) {
    try {
      const { name, surname, title, department, email, phone } = personnelData;
      
      const result = await pool.query(
        'UPDATE personnel SET name = COALESCE($1, name), surname = COALESCE($2, surname), title = COALESCE($3, title), department = COALESCE($4, department), email = COALESCE($5, email), phone = COALESCE($6, phone), updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
        [name, surname, title, department, email, phone, id]
      );
      
      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      console.error('Personnel update error:', error);
      return {
        success: false,
        error: 'Personel güncellenirken hata oluştu'
      };
    }
  },

  // Personel sil
  async delete(id: string) {
    try {
      await pool.query('DELETE FROM personnel WHERE id = $1', [id]);
      return {
        success: true,
        data: null
      };
    } catch (error) {
      console.error('Personnel delete error:', error);
      return {
        success: false,
        error: 'Personel silinirken hata oluştu'
      };
    }
  }
};