-- Reset Tables for Update
DROP TABLE IF EXISTS ai_analysis;
DROP TABLE IF EXISTS prescriptions;
DROP TABLE IF EXISTS ecg_reports;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS users;

-- Users Table (Doctors and Lab Assistants)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- In production, use hashed passwords
    role TEXT CHECK(role IN ('doctor', 'lab-assistant')) DEFAULT 'doctor',
    specialty TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Users
INSERT OR IGNORE INTO users (id, name, email, password, role, specialty) VALUES 
('doc_1', 'Dr. Sarah Chen', 'sarah.chen@heartplus.com', 'doc123', 'doctor', 'Cardiologist'),
('doc_2', 'Dr. James Wilson', 'james.wilson@heartplus.com', 'doc123', 'doctor', 'Cardiac Surgeon'),
('doc_3', 'Dr. Elena Rodriguez', 'elena.r@heartplus.com', 'doc123', 'doctor', 'Emergency Physician'),
('doc_4', 'Dr. Marcus Thorne', 'marcus.t@heartplus.com', 'doc123', 'doctor', 'Cardiologist'),
('doc_5', 'Dr. Priya Sharma', 'priya.s@heartplus.com', 'doc123', 'doctor', 'Internal Medicine'),
('lab_1', 'Alex Rivera', 'alex.rivera@heartplus.com', 'lab123', 'lab-assistant', 'Head Technician');

-- Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    mobile TEXT UNIQUE NOT NULL,
    history TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ECG Reports Table
CREATE TABLE IF NOT EXISTS ecg_reports (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    uploaded_by TEXT NOT NULL,
    file_url TEXT,
    status TEXT DEFAULT 'processing', -- processing, ai-evaluated, stable, critical, prescribed
    is_approved BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- AI Analysis table
CREATE TABLE IF NOT EXISTS ai_analysis (
  id TEXT PRIMARY KEY,
  report_id TEXT UNIQUE NOT NULL,
  confidence_score REAL,
  risk_level TEXT,
  observations TEXT,
  biomarkers TEXT, -- Stored as JSON string
  engine_version TEXT DEFAULT 'v4.2.0',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES ecg_reports(id)
);

-- Prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id TEXT PRIMARY KEY,
  report_id TEXT NOT NULL,
  doctor_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  diagnosis TEXT,
  notes TEXT,
  medications TEXT, -- Stored as JSON string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES ecg_reports(id),
  FOREIGN KEY (doctor_id) REFERENCES users(id),
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Insert some seed data for testing
INSERT INTO users (id, name, role, hospital_id) VALUES ('user_1', 'Dr. Sarah Chen', 'lab_assistant', 'HOSP-001');
INSERT INTO patients (id, name, mobile_number, age, gender, blood_group) VALUES ('pat_1', 'John Doe', '9876543210', 45, 'Male', 'O+');
INSERT INTO patients (id, name, mobile_number, age, gender, blood_group) VALUES ('pat_2', 'Rajesh Kumar', '1234567', 54, 'Male', 'O+');
