// backend/services/personnelService.ts
import { pool } from '../db.ts';

export const personnelService = {
  // Tüm personelleri getir
  async getAll() {
    try {
      const result = await pool.query('SELECT * FROM personnel ORDER BY id');
      // Frontend'in beklediği formata çevir
      const transformedData = result.rows.map(row => ({
        id: row.id,
        name: row.first_name,
        surname: row.last_name,
        title: row.title,
        department: row.department,
        email: row.email,
        phone: row.phone,
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
      return {
        success: true,
        data: transformedData
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
      const row = result.rows[0];
      if (row) {
        // Frontend'in beklediği formata çevir
        const transformedData = {
          id: row.id,
          name: row.first_name,
          surname: row.last_name,
          title: row.title,
          department: row.department,
          email: row.email,
          phone: row.phone,
          created_at: row.created_at,
          updated_at: row.updated_at
        };
        return {
          success: true,
          data: transformedData
        };
      } else {
        return {
          success: true,
          data: null
        };
      }
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
        'INSERT INTO personnel (first_name, last_name, title, department, email, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, surname, title, department, email, phone]
      );
      
      // Frontend'in beklediği formata çevir
      const row = result.rows[0];
      const transformedData = {
        id: row.id,
        name: row.first_name,
        surname: row.last_name,
        title: row.title,
        department: row.department,
        email: row.email,
        phone: row.phone,
        created_at: row.created_at,
        updated_at: row.updated_at
      };
      
      return {
        success: true,
        data: transformedData
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
        'UPDATE personnel SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name), title = COALESCE($3, title), department = COALESCE($4, department), email = COALESCE($5, email), phone = COALESCE($6, phone), updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
        [name, surname, title, department, email, phone, id]
      );
      
      // Frontend'in beklediği formata çevir
      const row = result.rows[0];
      const transformedData = {
        id: row.id,
        name: row.first_name,
        surname: row.last_name,
        title: row.title,
        department: row.department,
        email: row.email,
        phone: row.phone,
        created_at: row.created_at,
        updated_at: row.updated_at
      };
      
      return {
        success: true,
        data: transformedData
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