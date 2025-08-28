import { Pool } from 'pg';
import Database from 'better-sqlite3';

export const isSQLite = process.env.DB_DRIVER === 'sqlite';

let pgPool: Pool | null = null;
let sqliteDb: Database.Database | null = null;

function convertParams(sql: string): string {
  return sql.replace(/\$\d+/g, '?');
}

export async function query(sql: string, params: any[] = []): Promise<{ rows: any[]; lastID?: number; changes?: number }> {
  if (isSQLite) {
    if (!sqliteDb) {
      initSqlite();
    }
    const stmt = sqliteDb!.prepare(convertParams(sql));
    if (stmt.reader) {
      const rows = stmt.all(params);
      return { rows };
    } else {
      const info = stmt.run(params);
      return { rows: [], lastID: Number(info.lastInsertRowid), changes: info.changes };
    }
  } else {
    if (!pgPool) {
      pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    }
    const result = await pgPool.query(sql, params);
    return { rows: result.rows };
  }
}

export function initSqlite(): void {
  if (!sqliteDb) {
    const dbPath = process.env.SQLITE_PATH || './data/tse.db';
    sqliteDb = new Database(dbPath);
    sqliteDb.pragma('foreign_keys = ON');
  }
}

interface DbClient {
  query(sql: string, params?: any[]): Promise<{ rows: any[]; lastID?: number; changes?: number }>;
  begin(): Promise<void> | void;
  commit(): Promise<void> | void;
  rollback(): Promise<void> | void;
  release(): void;
}

export async function getClient(): Promise<DbClient> {
  if (isSQLite) {
    if (!sqliteDb) {
      initSqlite();
    }
    return {
      query: (sql: string, params: any[] = []) => {
        const stmt = sqliteDb!.prepare(convertParams(sql));
        if (stmt.reader) {
          const rows = stmt.all(params);
          return Promise.resolve({ rows });
        } else {
          const info = stmt.run(params);
          return Promise.resolve({ rows: [], lastID: Number(info.lastInsertRowid), changes: info.changes });
        }
      },
      begin: () => { sqliteDb!.exec('BEGIN'); },
      commit: () => { sqliteDb!.exec('COMMIT'); },
      rollback: () => { sqliteDb!.exec('ROLLBACK'); },
      release: () => { /* no-op for SQLite */ },
    };
  } else {
    if (!pgPool) {
      pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    }
    const client = await pgPool.connect();
    return {
      query: (sql: string, params: any[] = []) => client.query(sql, params).then((r) => ({ rows: r.rows })),
      begin: async () => {
        await client.query('BEGIN');
      },
      commit: async () => {
        await client.query('COMMIT');
      },
      rollback: async () => {
        await client.query('ROLLBACK');
      },
      release: () => client.release(),
    };
  }
}