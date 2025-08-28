import { query, isSQLite } from '../db';

export class ExperimentTypeRepository {
  async findAll() {
    const result = await query('SELECT * FROM experiment_types ORDER BY id ASC');
    return result.rows;
  }

  async findById(id: number) {
    const result = await query('SELECT * FROM experiment_types WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(data: { name: string; base_price: number }) {
    const baseSql = `INSERT INTO experiment_types (name, base_price, created_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)`;
    if (isSQLite) {
      const result = await query(baseSql, [data.name, data.base_price]);
      const row = await query('SELECT * FROM experiment_types WHERE id = $1', [result.lastID]);
      return row.rows[0];
    } else {
      const result = await query(baseSql + ' RETURNING *', [data.name, data.base_price]);
      return result.rows[0];
    }
  }

  async update(id: number, data: { name: string; base_price: number }) {
    const baseSql = `UPDATE experiment_types
       SET name = $1, base_price = $2
       WHERE id = $3`;
    if (isSQLite) {
      await query(baseSql, [data.name, data.base_price, id]);
      const row = await query('SELECT * FROM experiment_types WHERE id = $1', [id]);
      return row.rows[0] || null;
    } else {
      const result = await query(baseSql + ' RETURNING *', [data.name, data.base_price, id]);
      return result.rows[0] || null;
    }
  }

  async delete(id: number) {
    if (isSQLite) {
      const result = await query('DELETE FROM experiment_types WHERE id = $1', [id]);
      return (result.changes || 0) > 0;
    } else {
      const result = await query('DELETE FROM experiment_types WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    }
  }
}
