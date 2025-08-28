import { query, isSQLite } from '../db';
import bcrypt from 'bcrypt';

export interface UserData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  unvan?: string;
  phone?: string;
}

export interface UserUpdateData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'user';
  unvan?: string;
  phone?: string;
  password?: string; // Optional for updates
}

export class UserRepository {
  async findAll() {
    const result = await query(
      'SELECT id, username, first_name, last_name, email, role, unvan, phone, created_at FROM users ORDER BY id ASC'
    );
    return result.rows;
  }

  async findById(id: number) {
    const result = await query(
      'SELECT id, username, first_name, last_name, email, role, unvan, phone, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findByUsername(username: string) {
    const result = await query(
      'SELECT id, username, first_name, last_name, email, role, unvan, phone, created_at FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  }

  // Login için şifre ile birlikte kullanıcı bulma
  async findByUsernameWithPassword(username: string) {
    const result = await query(
      'SELECT id, username, first_name, last_name, email, role, unvan, phone, password_hash, created_at FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  }

  // Şifre doğrulama
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async findByEmail(email: string) {
    const result = await query(
      'SELECT id, username, first_name, last_name, email, role, unvan, phone, created_at FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async create(data: UserData) {
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(data.password, saltRounds);
    
    const baseSql = `INSERT INTO users (username, first_name, last_name, email, password_hash, role, unvan, phone, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`;
    if (isSQLite) {
      const result = await query(baseSql, [data.username, data.first_name, data.last_name, data.email, password_hash, data.role, data.unvan, data.phone]);
      const row = await query('SELECT id, username, first_name, last_name, email, role, unvan, phone, created_at FROM users WHERE id = $1', [result.lastID]);
      return row.rows[0];
    } else {
      const result = await query(baseSql + ' RETURNING id, username, first_name, last_name, email, role, unvan, phone, created_at', [data.username, data.first_name, data.last_name, data.email, password_hash, data.role, data.unvan, data.phone]);
      return result.rows[0];
    }
  }

  async update(id: number, data: UserUpdateData) {
    let sql: string;
    let values: any[];

    if (data.password) {
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(data.password, saltRounds);

      sql = `UPDATE users 
               SET username = $1, first_name = $2, last_name = $3, email = $4, 
                   password_hash = $5, role = $6, unvan = $7, phone = $8
               WHERE id = $9`;
      values = [data.username, data.first_name, data.last_name, data.email, password_hash, data.role, data.unvan, data.phone, id];
    } else {
      // Update without password
      sql = `UPDATE users 
               SET username = $1, first_name = $2, last_name = $3, email = $4, 
                   role = $5, unvan = $6, phone = $7
               WHERE id = $8`;
      values = [data.username, data.first_name, data.last_name, data.email, data.role, data.unvan, data.phone, id];
    }

    if (isSQLite) {
      await query(sql, values);
      const row = await query('SELECT id, username, first_name, last_name, email, role, unvan, phone, created_at FROM users WHERE id = $1', [id]);
      return row.rows[0] || null;
    } else {
      const result = await query(sql + ' RETURNING id, username, first_name, last_name, email, role, unvan, phone, created_at', values);
      return result.rows[0] || null;
    }
  }

  async delete(id: number) {
    if (isSQLite) {
      const result = await query('DELETE FROM users WHERE id = $1', [id]);
      return (result.changes || 0) > 0;
    } else {
      const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    }
  }
}
