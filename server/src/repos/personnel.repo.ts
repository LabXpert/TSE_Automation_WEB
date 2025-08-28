import { query, isSQLite } from '../db';

export class PersonnelRepository {
  async findAll() {
    const result = await query('SELECT * FROM personnel ORDER BY id ASC');
    return result.rows;
  }

  async findById(id: number) {
    const result = await query('SELECT * FROM personnel WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(data: { first_name: string; last_name: string; title: string }) {
    const baseSql = `INSERT INTO personnel (first_name, last_name, title, created_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`;
    if (isSQLite) {
      const result = await query(baseSql, [data.first_name, data.last_name, data.title]);
      const row = await query('SELECT * FROM personnel WHERE id = $1', [result.lastID]);
      return row.rows[0];
    } else {
      const result = await query(baseSql + ' RETURNING *', [data.first_name, data.last_name, data.title]);
      return result.rows[0];
    }
  }

  async update(id: number, data: { first_name: string; last_name: string; title: string }) {
    const baseSql = `UPDATE personnel
       SET first_name = $1, last_name = $2, title = $3
        WHERE id = $4`;
    if (isSQLite) {
      await query(baseSql, [data.first_name, data.last_name, data.title, id]);
      const row = await query('SELECT * FROM personnel WHERE id = $1', [id]);
      return row.rows[0] || null;
    } else {
      const result = await query(baseSql + ' RETURNING *', [data.first_name, data.last_name, data.title, id]);
      return result.rows[0] || null;
    }
  }

  async delete(id: number) {
    if (isSQLite) {
      const result = await query('DELETE FROM personnel WHERE id = $1', [id]);
      return (result.changes || 0) > 0;
    } else {
      const result = await query('DELETE FROM personnel WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    }
  }
}
