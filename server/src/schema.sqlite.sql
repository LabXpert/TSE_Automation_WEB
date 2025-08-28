PRAGMA foreign_keys = ON;

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  tax_no TEXT UNIQUE,
  contact_name TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

-- Personnel table
CREATE TABLE IF NOT EXISTS personnel (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

-- Experiment types table
CREATE TABLE IF NOT EXISTS experiment_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  base_price NUMERIC DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  application_no TEXT UNIQUE NOT NULL,
  application_date DATE NOT NULL,
  certification_type TEXT DEFAULT 'özel',
  test_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

-- Calibration organizations table
CREATE TABLE IF NOT EXISTS calibration_orgs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  org_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  CONSTRAINT uq_calibration_orgs_email UNIQUE (email)
);

-- Maintenance organizations table
CREATE TABLE IF NOT EXISTS maintenance_orgs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  org_name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  CONSTRAINT uq_maintenance_orgs_email UNIQUE (email)
);


-- Machines table
CREATE TABLE IF NOT EXISTS machines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  serial_no TEXT NOT NULL,
  equipment_name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  measurement_range TEXT,
  last_calibration_date DATE NOT NULL,
  calibration_org_id INTEGER NOT NULL REFERENCES calibration_orgs(id) ON DELETE RESTRICT,
  calibration_interval INTEGER NOT NULL DEFAULT 1,
  last_maintenance_date DATE NOT NULL DEFAULT (CURRENT_DATE),
  maintenance_org_id INTEGER NOT NULL REFERENCES maintenance_orgs(id) ON DELETE RESTRICT,
  maintenance_interval INTEGER NOT NULL DEFAULT 1
);

-- Machine maintenance history table
CREATE TABLE IF NOT EXISTS machine_maintenances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  machine_id INTEGER NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  maintenance_org_id INTEGER NOT NULL REFERENCES maintenance_orgs(id) ON DELETE RESTRICT,
  maintained_by TEXT,
  notes TEXT,
  maintenance_date DATE NOT NULL,
  next_maintenance_date DATE,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);


-- Machine calibration history table
CREATE TABLE IF NOT EXISTS machine_calibrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  machine_id INTEGER NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  calibration_org_id INTEGER NOT NULL REFERENCES calibration_orgs(id) ON DELETE RESTRICT,
  calibrated_by TEXT,
  notes TEXT,
  calibration_date DATE NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

-- Tests table
CREATE TABLE IF NOT EXISTS tests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  experiment_type_id INTEGER NOT NULL REFERENCES experiment_types(id) ON DELETE CASCADE,
  responsible_personnel_id INTEGER REFERENCES personnel(id),
  unit_price NUMERIC NOT NULL DEFAULT 0,
  sample_count INTEGER NOT NULL DEFAULT 1,
  is_accredited INTEGER NOT NULL DEFAULT 0,
  uygunluk INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  total_price NUMERIC,
  CONSTRAINT chk_tests_sample_count_positive CHECK (sample_count >= 1)
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  unvan TEXT,
  phone TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_companies_tax_no ON companies(tax_no);
CREATE INDEX IF NOT EXISTS idx_applications_company_id ON applications(company_id);
CREATE INDEX IF NOT EXISTS idx_applications_no ON applications(application_no);
CREATE INDEX IF NOT EXISTS idx_tests_application_id ON tests(application_id);
CREATE INDEX IF NOT EXISTS idx_tests_experiment_type_id ON tests(experiment_type_id);
CREATE INDEX IF NOT EXISTS idx_tests_personnel_id ON tests(responsible_personnel_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_machines_last_calibration_date ON machines(last_calibration_date);
CREATE INDEX IF NOT EXISTS idx_calibration_orgs_name ON calibration_orgs(org_name);
CREATE INDEX IF NOT EXISTS idx_machines_calibration_org_id ON machines(calibration_org_id);
CREATE INDEX IF NOT EXISTS idx_machine_calibrations_machine_id ON machine_calibrations(machine_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_orgs_name ON maintenance_orgs(org_name);
CREATE INDEX IF NOT EXISTS idx_machine_maintenances_machine_id ON machine_maintenances(machine_id);
CREATE INDEX IF NOT EXISTS idx_machine_maintenances_date ON machine_maintenances(maintenance_date);