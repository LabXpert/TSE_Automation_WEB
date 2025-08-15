import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './database/connection';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

// --- ROOT ---
app.get('/', (_req, res) => {
  res.send('API up');
});

// --- /api KÖK ---
app.get('/api', (_req, res) => {
  res.json({ ok: true, hint: 'try /api/health or /api/experiment-types' });
});

// --- HEALTH ---
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// --- EXPERIMENT TYPES LIST ---
app.get('/api/experiment-types', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM experiment_types ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching experiment_types:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// --- PERSONNEL LIST ---
app.get('/api/personnel', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM personnel ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching personnel:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// --- COMPANIES LIST ---
app.get('/api/companies', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM companies ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- ADD COMPANY ---
app.post('/api/companies', async (req, res) => {
  try {
    const { name, tax_no, contact_name, address, phone, email } = req.body;
    if (!name || !tax_no || !contact_name || !address || !phone || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await pool.query(
      `INSERT INTO companies (name, tax_no, contact_name, address, phone, email, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [name, tax_no, contact_name, address, phone, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- DELETE COMPANY ---
app.delete('/api/companies/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid company id' });
    await pool.query('DELETE FROM companies WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- UPDATE COMPANY ---
app.put('/api/companies/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, tax_no, contact_name, address, phone, email } = req.body;
    if (!id || !name || !tax_no || !contact_name || !address || !phone || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await pool.query(
      `UPDATE companies 
       SET name = $1, tax_no = $2, contact_name = $3, address = $4, phone = $5, email = $6
       WHERE id = $7
       RETURNING *`,
      [name, tax_no, contact_name, address, phone, email, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// --- ADD APPLICATION & TESTS ---
app.post('/api/applications', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const {
      company_id,
      application_no,
      application_date,
      certification_type,
      tests
    } = req.body;

    if (!company_id || !application_no || !application_date || !certification_type || !Array.isArray(tests) || tests.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create application
    const appResult = await client.query(
      `INSERT INTO applications (company_id, application_no, application_date, certification_type, test_count, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [company_id, application_no, new Date(application_date), certification_type, tests.length]
    );
    
    const newApp = appResult.rows[0];
    
    // Create tests
    const createdTests = [];
    for (const test of tests) {
      const testResult = await client.query(
        `INSERT INTO tests (application_id, experiment_type_id, responsible_personnel_id, unit_price, is_accredited, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *`,
        [newApp.id, test.experiment_type_id, test.responsible_personnel_id, test.unit_price || 0, !!test.is_accredited]
      );
      createdTests.push(testResult.rows[0]);
    }
    
    await client.query('COMMIT');
    
    // Return with tests included
    const response = {
      ...newApp,
      tests: createdTests
    };
    
    res.status(201).json(response);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
});

// --- GET RECENT APPLICATIONS ---
app.get('/api/applications/recent', async (_req, res) => {
  try {
      const result = await pool.query(`
        SELECT 
          a.*,
          c.name as company_name, c.tax_no, c.contact_name, c.address, c.phone, c.email,
          COALESCE(
            json_agg(
              json_build_object(
                'id', t.id,
                'experiment_type_id', t.experiment_type_id,
                'responsible_personnel_id', t.responsible_personnel_id,
                'unit_price', t.unit_price,
                'is_accredited', t.is_accredited,
                'created_at', t.created_at,
                'experiment_type_name', et.name,
                'experiment_type_base_price', et.base_price,
                'experiment_type_accredited_multiplier', et.accredited_multiplier,
                'personnel_first_name', p.first_name,
                'personnel_last_name', p.last_name,
                'personnel_title', p.title
              )
            ) FILTER (WHERE t.id IS NOT NULL), '[]'::json
          ) as tests
        FROM applications a
        LEFT JOIN companies c ON a.company_id = c.id
        LEFT JOIN tests t ON a.id = t.application_id
        LEFT JOIN experiment_types et ON t.experiment_type_id = et.id
        LEFT JOIN personnel p ON t.responsible_personnel_id = p.id
        GROUP BY a.id, c.id
        ORDER BY a.created_at DESC
        LIMIT 5
      `);
      
      const apps = result.rows.map(row => ({
        ...row,
        companies: {
          id: row.company_id,
          name: row.company_name,
          tax_no: row.tax_no,
          contact_name: row.contact_name,
          address: row.address,
          phone: row.phone,
          email: row.email
        }
      }));
      
      res.json(apps);
  } catch (error) {
    console.error('Error fetching recent applications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// --- GET ALL APPLICATIONS ---
app.get('/api/applications/all', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*,
        c.name as company_name, c.tax_no, c.contact_name, c.address, c.phone, c.email,
        COALESCE(
          json_agg(
            json_build_object(
              'id', t.id,
              'experiment_type_id', t.experiment_type_id,
              'responsible_personnel_id', t.responsible_personnel_id,
              'unit_price', t.unit_price,
              'is_accredited', t.is_accredited,
              'created_at', t.created_at,
              'experiment_type_name', et.name,
              'experiment_type_base_price', et.base_price,
              'experiment_type_accredited_multiplier', et.accredited_multiplier,
              'personnel_first_name', p.first_name,
              'personnel_last_name', p.last_name,
              'personnel_title', p.title
            )
          ) FILTER (WHERE t.id IS NOT NULL), '[]'::json
        ) as tests
      FROM applications a
      LEFT JOIN companies c ON a.company_id = c.id
      LEFT JOIN tests t ON a.id = t.application_id
      LEFT JOIN experiment_types et ON t.experiment_type_id = et.id
      LEFT JOIN personnel p ON t.responsible_personnel_id = p.id
      GROUP BY a.id, c.id
      ORDER BY a.created_at DESC
    `);
    
    const apps = result.rows.map(row => ({
      ...row,
      companies: {
        id: row.company_id,
        name: row.company_name,
        tax_no: row.tax_no,
        contact_name: row.contact_name,
        address: row.address,
        phone: row.phone,
        email: row.email
      }
    }));
    
    res.json(apps);
  } catch (error) {
    console.error('Error fetching all applications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- DELETE APPLICATION ---
app.delete('/api/applications/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid application id' });
    await pool.query('DELETE FROM applications WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- UPDATE APPLICATION ---
app.put('/api/applications/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const id = Number(req.params.id);
    const { company_id, application_no, application_date, certification_type, tests } = req.body;
    
    if (!id || !company_id || !application_no || !application_date || !certification_type || !Array.isArray(tests) || tests.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Update application
    const appResult = await client.query(
      `UPDATE applications 
       SET company_id = $1, application_no = $2, application_date = $3, certification_type = $4, test_count = $5
       WHERE id = $6
       RETURNING *`,
      [company_id, application_no, new Date(application_date), certification_type, tests.length, id]
    );
    
    if (appResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Application not found' });
    }
    
    // Delete old tests
    await client.query('DELETE FROM tests WHERE application_id = $1', [id]);
    
    // Create new tests
    const createdTests = [];
    for (const test of tests) {
      const testResult = await client.query(
        `INSERT INTO tests (application_id, experiment_type_id, responsible_personnel_id, unit_price, is_accredited, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *`,
        [id, test.experiment_type_id, test.responsible_personnel_id, test.unit_price || 0, !!test.is_accredited]
      );
      createdTests.push(testResult.rows[0]);
    }
    
    await client.query('COMMIT');
    
    // Return updated application with tests
    const response = {
      ...appResult.rows[0],
      tests: createdTests
    };
    
    res.json(response);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
});


app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
