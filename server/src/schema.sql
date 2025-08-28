-- TSE Automation Database Schema
-- PostgreSQL Database Schema
-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  tax_no VARCHAR(50) UNIQUE,
  contact_name VARCHAR(255),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP(6) DEFAULT NOW()
);
-- Personnel table
CREATE TABLE IF NOT EXISTS personnel (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  title VARCHAR(100) NOT NULL,
  created_at TIMESTAMP(6) DEFAULT NOW()
);
-- Experiment types table
CREATE TABLE IF NOT EXISTS experiment_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  base_price DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP(6) DEFAULT NOW()
);
-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  application_no VARCHAR(50) UNIQUE NOT NULL,
  application_date DATE NOT NULL,
  certification_type VARCHAR(50) DEFAULT 'özel',
  test_count INTEGER DEFAULT 0,
  created_at TIMESTAMP(6) DEFAULT NOW()
);
-- Tests table
CREATE TABLE IF NOT EXISTS tests (
  id SERIAL PRIMARY KEY,
  application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
  experiment_type_id INTEGER REFERENCES experiment_types(id) ON DELETE CASCADE,
  responsible_personnel_id INTEGER REFERENCES personnel(id),
  unit_price DECIMAL(10,2) DEFAULT 0,
  sample_count INTEGER NOT NULL DEFAULT 1,
  is_accredited BOOLEAN DEFAULT FALSE,
  uygunluk BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP(6) DEFAULT NOW(),
  total_price DECIMAL(12,2) GENERATED ALWAYS AS (unit_price) STORED,
  CONSTRAINT chk_tests_sample_count_positive CHECK (sample_count >= 1)
);
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  unvan VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP(6) DEFAULT NOW()
);
-- Machines table
CREATE TABLE IF NOT EXISTS machines (
  id SERIAL PRIMARY KEY,
  serial_no TEXT NOT NULL,
  equipment_name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  measurement_range TEXT,
  -- Kalibrasyon bilgileri
  last_calibration_date DATE NOT NULL,
  calibration_org_id INTEGER NOT NULL REFERENCES calibration_orgs(id) ON DELETE RESTRICT,
  calibration_interval INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT chk_calib_interval_pos CHECK (calibration_interval >= 1),
  -- Bakım bilgileri
  last_maintenance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  maintenance_org_id INTEGER NOT NULL REFERENCES maintenance_orgs(id) ON DELETE RESTRICT,
  maintenance_interval INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT chk_maint_interval_pos CHECK (maintenance_interval >= 1)
);
-- Calibration organizations table
CREATE TABLE IF NOT EXISTS calibration_orgs (
  id SERIAL PRIMARY KEY,
  org_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  CONSTRAINT uq_calibration_orgs_email UNIQUE (email)
);
-- Machine calibration history table
CREATE TABLE IF NOT EXISTS machine_calibrations (
  id SERIAL PRIMARY KEY,
  machine_id INTEGER NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  calibration_org_id INTEGER NOT NULL REFERENCES calibration_orgs(id) ON DELETE RESTRICT,
  calibrated_by TEXT,
  notes TEXT,
  calibration_date DATE NOT NULL,
  created_at TIMESTAMP(6) DEFAULT NOW()
);
-- Maintenance organizations table
CREATE TABLE IF NOT EXISTS maintenance_orgs (
  id SERIAL PRIMARY KEY,
  org_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  CONSTRAINT uq_maintenance_orgs_email UNIQUE (email),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Machine maintenance history table
CREATE TABLE IF NOT EXISTS machine_maintenances (
  id SERIAL PRIMARY KEY,
  machine_id INTEGER NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  maintenance_org_id INTEGER NOT NULL REFERENCES maintenance_orgs(id) ON DELETE RESTRICT,
  maintained_by TEXT,
  notes TEXT,
  maintenance_date DATE NOT NULL,
  next_maintenance_date DATE,
  created_at TIMESTAMP(6) DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_tax_no ON companies(tax_no);
CREATE INDEX IF NOT EXISTS idx_applications_company_id ON applications(company_id);
CREATE INDEX IF NOT EXISTS idx_applications_no ON applications(application_no);
CREATE INDEX IF NOT EXISTS idx_tests_application_id ON tests(application_id);
CREATE INDEX IF NOT EXISTS idx_tests_experiment_type_id ON tests(experiment_type_id);
CREATE INDEX IF NOT EXISTS idx_tests_personnel_id ON tests(responsible_personnel_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_machines_last_calibration_date ON machines(last_calibration_date);
CREATE INDEX IF NOT EXISTS idx_calibration_orgs_name ON calibration_orgs (org_name);
CREATE INDEX IF NOT EXISTS idx_machines_calibration_org_id ON machines(calibration_org_id);
CREATE INDEX IF NOT EXISTS idx_machine_calibrations_machine_id ON machine_calibrations(machine_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_orgs_name ON maintenance_orgs (org_name);
CREATE INDEX IF NOT EXISTS idx_machine_maintenances_machine_id ON machine_maintenances(machine_id);
CREATE INDEX IF NOT EXISTS idx_machine_maintenances_date ON machine_maintenances(maintenance_date);
