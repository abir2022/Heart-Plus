import React, { useState } from 'react';
import {
  Search, User, Phone, Calendar, Hash, Activity,
  AlertTriangle, Edit3, CheckCircle, Printer, ChevronRight,
  FileText, Shield, Clock
} from 'lucide-react';
import { api } from '../services/api';
import './PatientConsultation.css';

const RISK_COLORS = {
  LOW: '#10b981', STABLE: '#10b981',
  MEDIUM: '#f59e0b',
  HIGH: '#ef4444',
  CRITICAL: '#7c3aed',
};

const PatientConsultation = ({ user }) => {
  const [searchQuery, setSearchQuery]   = useState('');
  const [patient, setPatient]           = useState(null);
  const [reports, setReports]           = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [saving, setSaving]             = useState(false);
  const [success, setSuccess]           = useState(false);

  // Editable AI fields
  const [risk, setRisk]               = useState('');
  const [observations, setObservations] = useState('');
  const [biomarkers, setBiomarkers]   = useState('');

  // Prescription fields
  const [diagnosis, setDiagnosis]     = useState('');
  const [medications, setMedications] = useState('');
  const [notes, setNotes]             = useState('');
  const [signature, setSignature]     = useState(user?.name || '');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPatient(null);
    setReports([]);
    setSelectedReport(null);
    setSuccess(false);
    try {
      const data = await api.getPatientByMobile(searchQuery);
      setPatient(data.patient);
      setReports(data.reports || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectReport = (rep) => {
    setSelectedReport(rep);
    setRisk(rep.risk_level || 'STABLE');
    setObservations(rep.observations || '');
    setBiomarkers(
      Array.isArray(JSON.parse(rep.biomarkers || '[]'))
        ? JSON.parse(rep.biomarkers || '[]').join(', ')
        : ''
    );
    setDiagnosis(rep.diagnosis || '');
    setMedications(rep.medications || '');
    setNotes(rep.notes || '');
    setSuccess(false);
  };

  const handleFinalize = async () => {
    if (user?.role !== 'doctor') {
      alert('Access Denied: Only doctors can finalize prescriptions.');
      return;
    }
    if (!selectedReport) return;
    if (!diagnosis) { alert('Please enter a diagnosis.'); return; }
    if (!signature) { alert('Please enter your digital signature (name).'); return; }

    setSaving(true);
    try {
      await api.finalizeReport({
        reportId: selectedReport.id,
        doctorId: user.id,
        patientId: patient.id,
        aiId: selectedReport.ai_id,
        risk_level: risk,
        observations,
        biomarkers: JSON.stringify(biomarkers.split(',').map(b => b.trim()).filter(Boolean)),
        diagnosis,
        notes,
        medications,
        doctor_signature: signature,
      });
      setSuccess(true);
      // Refresh report list
      const data = await api.getPatientByMobile(searchQuery);
      setReports(data.reports || []);
      const updated = data.reports.find(r => r.id === selectedReport.id);
      if (updated) selectReport(updated);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    if (selectedReport) window.open(`/print/${selectedReport.id}`, '_blank');
  };

  return (
    <div className="patient-consultation animate-slide-in">
      {/* Search Bar */}
      <div className="search-bar-header card">
        <form onSubmit={handleSearch} className="search-form">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Enter Patient Mobile Number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Find Patient'}
          </button>
        </form>
      </div>

      {patient ? (
        <div className="consultation-layout">
          {/* LEFT COLUMN */}
          <div className="consultation-left">
            {/* Patient Info (Read-Only) */}
            <div className="patient-profile card">
              <div className="profile-header">
                <div className="profile-avatar flex-center"><User size={36} /></div>
                <div className="profile-main">
                  <h2>{patient.name}</h2>
                  <span className="patient-mobile-badge">
                    <Phone size={13} /> {patient.mobile}
                  </span>
                </div>
              </div>
              <div className="profile-details">
                <div className="detail-row"><Calendar size={14} /><span>Age: {patient.age || '—'}</span></div>
                <div className="detail-row"><Hash size={14} /><span>ID: {patient.id}</span></div>
                <div className="detail-row read-only-badge"><Shield size={14} /><span>Read-Only Profile</span></div>
              </div>
            </div>

            {/* Reports List */}
            <div className="reports-panel card">
              <h3 className="panel-title"><FileText size={16} /> ECG Reports ({reports.length})</h3>
              {reports.length === 0 ? (
                <p className="no-reports">No ECG reports found for this patient.</p>
              ) : (
                <div className="report-list">
                  {reports.map((rep) => (
                    <div
                      key={rep.id}
                      className={`report-list-item ${selectedReport?.id === rep.id ? 'active' : ''}`}
                      onClick={() => selectReport(rep)}
                    >
                      <div className="rli-left">
                        <span
                          className="risk-dot"
                          style={{ background: RISK_COLORS[rep.risk_level] || '#94a3b8' }}
                        ></span>
                        <div>
                          <p className="rli-date">{new Date(rep.created_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}</p>
                          <p className="rli-id">{rep.id}</p>
                        </div>
                      </div>
                      <div className="rli-right">
                        {rep.is_approved
                          ? <span className="badge-approved"><CheckCircle size={12} /> Approved</span>
                          : <span className="badge-pending"><Clock size={12} /> Pending</span>}
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          {selectedReport ? (
            <div className="consultation-right">
              {success && (
                <div className="success-banner">
                  <CheckCircle size={18} /> Report Approved & Prescription Saved!
                </div>
              )}

              {/* AI Findings (Editable) */}
              <div className="card section-card">
                <div className="section-header">
                  <Activity size={18} />
                  <h3>AI ECG Evaluation</h3>
                  <span className="edit-badge"><Edit3 size={12} /> Doctor can edit</span>
                </div>

                <div className="ai-edit-grid">
                  <div className="form-group">
                    <label>RISK LEVEL</label>
                    <select value={risk} onChange={(e) => setRisk(e.target.value)} className="risk-select">
                      <option value="LOW">LOW</option>
                      <option value="STABLE">STABLE</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>BIOMARKERS (comma-separated)</label>
                    <input
                      type="text"
                      value={biomarkers}
                      onChange={(e) => setBiomarkers(e.target.value)}
                      placeholder="e.g. ST Elevation, Tachycardia"
                    />
                  </div>
                </div>

                <div className="form-group mt-1">
                  <label>AI OBSERVATIONS (editable)</label>
                  <textarea
                    rows={4}
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Describe the ECG findings..."
                  />
                </div>
              </div>

              {/* Prescription */}
              <div className="card section-card">
                <div className="section-header">
                  <Edit3 size={18} />
                  <h3>Prescription</h3>
                </div>

                <div className="form-group">
                  <label>DIAGNOSIS *</label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Inferior Wall MI, Sinus Tachycardia"
                  />
                </div>
                <div className="form-group">
                  <label>MEDICATIONS & DOSAGE</label>
                  <textarea
                    rows={3}
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                    placeholder="e.g. Aspirin 75mg once daily, Metoprolol 25mg twice daily..."
                  />
                </div>
                <div className="form-group">
                  <label>DOCTOR'S NOTES & FOLLOW-UP</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Follow-up in 2 weeks, avoid strenuous activity..."
                  />
                </div>

                {/* Digital Signature */}
                <div className="signature-block">
                  <div className="sig-label"><AlertTriangle size={14} /> DOCTOR'S DIGITAL SIGNATURE</div>
                  <input
                    type="text"
                    className="sig-input"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Type your full name to sign..."
                  />
                  <p className="sig-note">Signed on: {new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' })}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="action-bar card">
                <button
                  className="btn-primary finalize-btn"
                  onClick={handleFinalize}
                  disabled={saving || user?.role !== 'doctor'}
                >
                  <CheckCircle size={18} />
                  <span>{saving ? 'Saving...' : 'Finalize & Approve'}</span>
                </button>
                {selectedReport.is_approved ? (
                  <button className="btn-outline" onClick={handlePrint}>
                    <Printer size={18} />
                    <span>Print / Download PDF</span>
                  </button>
                ) : (
                  <p className="print-hint">Finalize the report to enable printing.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="no-selection flex-center">
              <FileText size={48} color="var(--border-color)" />
              <p>Select an ECG report from the list to review and prescribe.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state flex-center">
          <div className="empty-content text-center">
            <Search size={60} color="var(--border-color)" />
            <h2>Find a Patient</h2>
            <p>Enter a patient's mobile number to view their ECG history and write a prescription.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientConsultation;
