import { Pool } from 'pg';

// PostgreSQL connection pool
export const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'tse_appdb',
  user: 'postgres',
  password: 'postgres',
});

// Database bağlantı testi
export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL bağlantısı başarılı!');
    
    // Test sorgusu - companies tablosunu kontrol et
    const result = await client.query('SELECT COUNT(*) FROM companies');
    console.log(`📊 Companies tablosunda ${result.rows[0].count} kayıt var`);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL bağlantı hatası:', error);
    return false;
  }
}