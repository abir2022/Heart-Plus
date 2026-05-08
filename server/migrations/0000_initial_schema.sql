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

-- Seed Staff (Doctors & Lab Assistants)
INSERT OR IGNORE INTO users (id, name, email, password, role, specialty) VALUES 
('doc_1', 'Dr. Sarah Chen', 'sarah.chen@heartplus.com', 'admin123', 'doctor', 'Senior Cardiologist'),
('doc_2', 'Dr. James Wilson', 'james.wilson@heartplus.com', 'doctor123', 'doctor', 'Cardiac Surgeon'),
('doc_3', 'Dr. Maria Garcia', 'maria.garcia@heartplus.com', 'doctor123', 'doctor', 'Electrophysiologist'),
('doc_4', 'Dr. Robert Lee', 'robert.lee@heartplus.com', 'doctor123', 'doctor', 'Pediatric Cardiologist'),
('doc_5', 'Dr. Aisha Khan', 'aisha.khan@heartplus.com', 'doctor123', 'doctor', 'Cardiovascular Specialist'),
('lab_1', 'Alex Rivera', 'lab@heartplus.com', 'lab123', 'lab-assistant', 'Senior ECG Technician');

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

-- Seed Patient for Demo
INSERT OR IGNORE INTO patients (id, name, mobile, age, gender) VALUES 
('pat_1', 'John Doe', '01712345678', 45, 'Male');

-- End of Schema Reset
