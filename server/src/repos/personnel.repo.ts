import pool from '../database/connection';

export class PersonnelRepository {
  async findAll() {
    const result = await pool.query(
      'SELECT * FROM personnel ORDER BY id ASC'
    );
    return result.rows;
  }

  async findById(id: number) {
    const result = await pool.query(
      'SELECT * FROM personnel WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: { first_name: string; last_name: string; title: string }) {
    const result = await pool.query(
      `INSERT INTO personnel (first_name, last_name, title, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [data.first_name, data.last_name, data.title]
    );
    return result.rows[0];
  }

  async update(id: number, data: { first_name: string; last_name: string; title: string }) {
    const result = await pool.query(
      `UPDATE personnel 
       SET first_name = $1, last_name = $2, title = $3
       WHERE id = $4
       RETURNING *`,
      [data.first_name, data.last_name, data.title, id]
    );
    return result.rows[0] || null;
  }

  async delete(id: number) {
    const result = await pool.query('DELETE FROM personnel WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }
}
