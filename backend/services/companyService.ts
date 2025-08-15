// backend/services/companyService.ts
import { pool } from '../db.ts';

export const companyService = {
  // Tüm firmaları getir
  async getAll() {
    try {
      const result = await pool.query('SELECT * FROM companies ORDER BY id');
      return {
        success: true,
        data: result.rows
      };
    } catch (error) {
      console.error('Company getAll error:', error);
      return {
        success: false,
        error: 'Firmalar alınırken hata oluştu'
      };
    }
  },

  // Yeni firma ekle
  async create(companyData: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    contact_name?: string;
    tax_no?: string;
  }) {
    try {
      const { name, email, phone, address, contact_name, tax_no } = companyData;
      
      const result = await pool.query(
        'INSERT INTO companies (name, email, phone, address, contact_name, tax_no) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, email, phone, address, contact_name, tax_no]
      );
      
      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      console.error('Company create error:', error);
      return {
        success: false,
        error: 'Firma eklenirken hata oluştu'
      };
    }
  },

  // ID'ye göre firma getir
  async getById(id: string) {
    try {
      const result = await pool.query('SELECT * FROM companies WHERE id = $1', [id]);
      return {
        success: true,
        data: result.rows[0] || null
      };
    } catch (error) {
      console.error('Company getById error:', error);
      return {
        success: false,
        error: 'Firma bulunamadı'
      };
    }
  },

  // Firma güncelle
  async update(id: string, companyData: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    contact_name?: string;
    tax_no?: string;
  }) {
    try {
      const { name, email, phone, address, contact_name, tax_no } = companyData;
      
      const result = await pool.query(
        'UPDATE companies SET name = COALESCE($1, name), email = COALESCE($2, email), phone = COALESCE($3, phone), address = COALESCE($4, address), contact_name = COALESCE($5, contact_name), tax_no = COALESCE($6, tax_no) WHERE id = $7 RETURNING *',
        [name, email, phone, address, contact_name, tax_no, id]
      );
      
      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      console.error('Company update error:', error);
      return {
        success: false,
        error: 'Firma güncellenirken hata oluştu'
      };
    }
  },

  // Firma sil
  async delete(id: string) {
    try {
      const result = await pool.query('DELETE FROM companies WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'Silinecek firma bulunamadı'
        };
      }
      
      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      console.error('Company delete error:', error);
      return {
        success: false,
        error: 'Firma silinirken hata oluştu'
      };
    }
  }
};