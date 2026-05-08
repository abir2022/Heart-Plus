import React, { useState } from 'react';
import { Search, Activity, User, Phone, Calendar, Hash, CheckCircle, Save, Printer, Edit3 } from 'lucide-react';
import Waveform from '../components/Waveform';
import { api } from '../services/api';
import './PatientConsultation.css';

const PatientConsultation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medication, setMedication] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.searchPatient(searchQuery);
      setPatient(data);
      if (!data) alert("No patient found with this number.");
    } catch (err) {
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    if (!patient) return;
    try {
      await api.savePrescription({
        reportId: 'report_demo', // Placeholder
        doctorId: 'user_1',
        patientId: patient.id,
        diagnosis,
        notes,
        medications: medication
      });
      alert("Prescription Finalized & Saved!");
    } catch (err) {
      alert("Failed to save: " + err.message);
    }
  };

  return (
    <div className="patient-consultation animate-slide-in">
      <div className="search-bar-header card">
        <form onSubmit={handleSearch} className="search-form">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Enter Patient Mobile Number to View History..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary">Search Patient</button>
        </form>
      </div>

      {loading ? (
        <div className="empty-state flex-center"><h3>Searching...</h3></div>
      ) : patient ? (
        <div className="consultation-content">
          <div className="patient-profile card">
            <div className="profile-header">
              <div className="profile-avatar flex-center">
                <User size={40} />
              </div>
              <div className="profile-main">
                <h2>{patient.name}</h2>
                <div className="tags">
                  <span className="age-tag">{patient.age} Years • {patient.gender} • {patient.blood_group}</span>
                  <span className="condition-tag stable">STABLE CONDITION</span>
                </div>
              </div>
            </div>
            
            <div className="profile-details">
              <div className="detail-row">
                <Phone size={16} />
                <span>{patient.mobile_number}</span>
              </div>
              <div className="detail-row">
                <Calendar size={16} />
                <span>Joined: {new Date(patient.created_at).toLocaleDateString()}</span>
              </div>
              <div className="detail-row">
                <Hash size={16} />
                <span>Patient ID: {patient.id}</span>
              </div>
            </div>
          </div>

          <div className="ecg-analysis-summary card">
            <div className="card-header flex-between">
              <h3 className="flex-center" style={{ gap: '0.5rem' }}>
                <Activity size={18} /> ECG Waveform Analysis
              </h3>
              <div className="toggle-compare">
                <input type="checkbox" id="compare" />
                <label htmlFor="compare">Compare with Previous</label>
              </div>
            </div>
            <div className="analysis-box">
              <Waveform height={150} />
              <div className="analysis-metrics">
                <div className="metric">
                  <span className="label">HEART RATE</span>
                  <span className="value">72 <span className="unit">BPM</span></span>
                </div>
                <div className="metric">
                  <span className="label">QT INTERVAL</span>
                  <span className="value">390 <span className="unit">ms</span></span>
                </div>
                <div className="metric">
                  <span className="label">AI RESULT</span>
                  <span className="value success">Sinus Rhythm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="prescription-section card">
            <div className="card-header flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start' }}>
              <Edit3 size={20} />
              <h3>Digital Consultation & Prescription</h3>
            </div>
            
            <div className="prescription-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>DIAGNOSIS</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mild Hypertension, Tachycardia" 
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>DOCTOR'S NOTES</label>
                  <textarea 
                    placeholder="Additional observations, diet recommendations, follow-up instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
              
              <div className="form-group">
                <label>MEDICATION</label>
                <input 
                  type="text" 
                  placeholder="Drug name, dosage, frequency..." 
                  value={medication}
                  onChange={(e) => setMedication(e.target.value)}
                />
              </div>

              <div className="form-footer flex-between">
                <p className="hint">Letterhead Preview Generator Enabled</p>
                <div className="actions">
                  <button className="btn-outline">
                    <Save size={18} />
                    <span>Draft Save</span>
                  </button>
                  <button className="btn-primary" onClick={handleFinalize}>
                    <CheckCircle size={18} />
                    <span>Finalize & Print</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="prescription-preview card">
             <div className="preview-header flex-between">
               <div className="hospital-brand">
                 <h3>MedLab Pro</h3>
                 <span>Diagnostics & Cardiac Research</span>
               </div>
               <div className="hospital-contact">
                 <p>123 Medical Avenue, Healthcare City</p>
                 <p>support@medlabpro.com | +1 800 555 0199</p>
               </div>
             </div>
             <div className="preview-body">
               <div className="preview-line"></div>
               <div className="preview-line short"></div>
               <div className="preview-signature flex-center">
                 <div className="sig-line">
                   <p>Authorized Signature</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="empty-state flex-center">
          <div className="empty-content text-center">
             <div className="search-illustration">
                <Search size={60} color="var(--border-color)" />
             </div>
             <h2>Search for a patient</h2>
             <p>Enter a mobile number to retrieve patient history and start consultation.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientConsultation;
