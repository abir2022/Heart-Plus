import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ScanECG from './pages/ScanECG';
import DiagnosticDetail from './pages/DiagnosticDetail';
import PatientConsultation from './pages/PatientConsultation';

// Placeholder components for other routes
const Placeholder = ({ title }) => (
  <div className="flex-center" style={{ height: '50vh', flexDirection: 'column' }}>
    <h1 style={{ color: 'var(--text-muted)' }}>{title}</h1>
    <p style={{ color: 'var(--text-muted)' }}>This page is coming soon.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scan" element={<ScanECG />} />
          <Route path="/report/:id" element={<DiagnosticDetail />} />
          <Route path="/patients" element={<Placeholder title="Patient Records" />} />
          <Route path="/reports" element={<Placeholder title="Lab Reports" />} />
          <Route path="/prescriptions" element={<PatientConsultation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
