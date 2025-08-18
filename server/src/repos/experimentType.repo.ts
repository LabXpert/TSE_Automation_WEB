import pool from '../database/connection';

export class ExperimentTypeRepository {
  async findAll() {
    const result = await pool.query(
      'SELECT * FROM experiment_types ORDER BY id ASC'
    );
    return result.rows;
  }

  async findById(id: number) {
    const result = await pool.query(
      'SELECT * FROM experiment_types WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: { name: string; base_price: number }) {
    const result = await pool.query(
      `INSERT INTO experiment_types (name, base_price, created_at)
       VALUES ($1, $2, NOW())
       RETURNING *`,
      [data.name, data.base_price]
    );
    return result.rows[0];
  }

  async update(id: number, data: { name: string; base_price: number }) {
    const result = await pool.query(
      `UPDATE experiment_types 
       SET name = $1, base_price = $2
       WHERE id = $3
       RETURNING *`,
      [data.name, data.base_price, id]
    );
    return result.rows[0] || null;
  }

  async delete(id: number) {
    const result = await pool.query('DELETE FROM experiment_types WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }
}
