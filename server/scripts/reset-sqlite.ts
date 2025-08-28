import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const dbPath = process.env.SQLITE_PATH || path.resolve(__dirname, '../data/tse.db');
const dataDir = path.dirname(dbPath);
fs.mkdirSync(dataDir, { recursive: true });
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}
const schemaPath = path.resolve(__dirname, '../src/schema.sqlite.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');
const db = new Database(dbPath);
db.exec(schema);
console.log('SQLite database reset at', dbPath);