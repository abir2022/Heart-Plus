import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ScanECG from './pages/ScanECG';
import DiagnosticDetail from './pages/DiagnosticDetail';
import PatientConsultation from './pages/PatientConsultation';
import Login from './pages/Login';
import PatientPortal from './pages/PatientPortal';
import Home from './pages/Home';
import PrescriptionPrint from './pages/PrescriptionPrint';

// Placeholder components for other routes
const Placeholder = ({ title }) => (
  <div className="flex-center" style={{ height: '50vh', flexDirection: 'column' }}>
    <h1 style={{ color: 'var(--text-muted)' }}>{title}</h1>
    <p style={{ color: 'var(--text-muted)' }}>This page is coming soon.</p>
  </div>
);

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/patient-portal" element={<PatientPortal />} />
        <Route path="/print/:id" element={<PrescriptionPrint />} />
        
        <Route path="/dashboard/*" element={
          user ? (
            <Layout user={user} onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/scan" element={<ScanECG user={user} />} />
                <Route path="/prescriptions" element={<PatientConsultation user={user} />} />
                <Route path="/report/:id" element={<DiagnosticDetail user={user} />} />
                <Route path="/patients" element={<Placeholder title="Patient Records" />} />
                <Route path="/reports" element={<Placeholder title="Lab Reports" />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
// Build Date: 2026-05-08-11-55