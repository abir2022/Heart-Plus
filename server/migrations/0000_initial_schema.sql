-- Heart+ D1 Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT CHECK(role IN ('doctor', 'lab_assistant')) NOT NULL,
  hospital_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mobile_number TEXT UNIQUE NOT NULL,
  age INTEGER,
  gender TEXT,
  blood_group TEXT,
  hospital_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ECG Reports table
CREATE TABLE IF NOT EXISTS ecg_reports (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  file_url TEXT NOT NULL,
  analysis_type TEXT DEFAULT 'Routine Check',
  status TEXT CHECK(status IN ('processing', 'ai-evaluated', 'critical', 'stable', 'sent')) DEFAULT 'processing',
  upload_time DATETIME DEFAULT CURRENT_TIMESTAMP,
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
