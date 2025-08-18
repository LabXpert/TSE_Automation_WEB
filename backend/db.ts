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

    // Test sorgusu - applications tablosunu kontrol et
    const result1 = await client.query('SELECT COUNT(*) FROM applications');
    console.log(`📊 Applications tablosunda ${result1.rows[0].count} kayıt var`);

    // Test sorgusu - users tablosunu kontrol et
    const result2 = await client.query('SELECT COUNT(*) FROM users');
    console.log(`📊 Users tablosunda ${result2.rows[0].count} kayıt var`);

    // Test sorgusu - personnel tablosunu kontrol et
    const result3 = await client.query('SELECT COUNT(*) FROM personnel');
    console.log(`📊 Personnel tablosunda ${result3.rows[0].count} kayıt var`);

    // Test sorgusu - experiment-types tablosunu kontrol et
    const result4 = await client.query('SELECT COUNT(*) FROM experiment_types');
    console.log(`📊 Experiment-types tablosunda ${result4.rows[0].count} kayıt var`);
  
    client.release();
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL bağlantı hatası:', error);
    return false;
  }
}