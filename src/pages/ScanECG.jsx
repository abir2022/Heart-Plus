import React, { useState } from 'react';
import { Upload, Camera, Printer, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import Waveform from '../components/Waveform';
import { api } from '../services/api';
import './ScanECG.css';

const ScanECG = ({ user }) => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [patientMobile, setPatientMobile] = useState('');
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await api.getReports();
      setRecentReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!patientMobile) {
      alert("Please enter patient mobile number first.");
      return;
    }
    try {
      const result = await api.uploadECG(file, patientMobile, user.id);
      navigate(`/dashboard/report/${result.reportId}`);
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const onFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="scan-ecg animate-slide-in">
      <div className="page-header flex-between">
        <div>
          <h1>Scan New ECG</h1>
          <p className="subtitle">Upload patient waveform data for AI analysis and physician review.</p>
        </div>
        <div className="patient-quick-input card flex-center" style={{ padding: '0.5rem 1rem', gap: '1rem' }}>
          <div className="input-group">
            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-blue)' }}>PATIENT MOBILE</label>
            <input 
              type="text" 
              placeholder="Enter mobile..." 
              style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: 600 }}
              value={patientMobile}
              onChange={(e) => setPatientMobile(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="scan-grid">
        <div 
          className={`upload-zone card ${isDragging ? 'dragging' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          <div className="upload-content flex-center">
            <div className="upload-icon-wrapper flex-center">
              <Upload size={32} color="var(--primary-blue)" />
            </div>
            <h2>Drag and drop ECG data</h2>
            <p>Support for DICOM, SCP-ECG, and High-Res Image formats. Ensure all 12-leads are clearly visible.</p>
            <div className="upload-actions">
              <input 
                type="file" 
                id="file-upload" 
                hidden 
                onChange={onFileSelect}
                accept="image/*,.pdf,.dicom"
              />
              <button 
                className="btn-primary"
                onClick={() => document.getElementById('file-upload').click()}
              >
                Browse Files
              </button>
              <button className="btn-outline">
                <Camera size={18} />
                <span>Capture from Scanner</span>
              </button>
            </div>
          </div>
        </div>

        <div className="preview-zone card">
          <div className="card-header flex-between">
            <h3 className="flex-center" style={{ gap: '0.5rem' }}>
              <RotateCcw size={18} /> Live Preview
            </h3>
            <span className="format-label">FORMAT: DICOM-3</span>
          </div>
          <div className="preview-content">
            <Waveform height={250} color="#dc3545" />
            <div className="preview-overlay">
              <span className="scanning-line"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="reports-section card">
        <div className="card-header flex-between">
          <h3>Recent Reports Status Board</h3>
          <div className="flex-center" style={{ gap: '1rem' }}>
            <button className="icon-btn"><SlidersHorizontal size={18} /></button>
            <button className="icon-btn"><RotateCcw size={18} /></button>
          </div>
        </div>
        
        <table className="reports-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Hospital ID</th>
              <th>Upload Time</th>
              <th>Analysis Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center">Loading reports...</td></tr>
            ) : recentReports.map((report, index) => (
              <tr key={index}>
                <td className="patient-cell">
                  <div className="avatar flex-center">{(report.patient_name || 'P').charAt(0)}</div>
                  <span className="font-600">{report.patient_name}</span>
                </td>
                <td>{report.id}</td>
                <td>{new Date(report.upload_time).toLocaleString()}</td>
                <td>{report.analysis_type}</td>
                <td>
                  <StatusBadge type={report.status} />
                </td>
                <td>
                  <button 
                    className="text-link" 
                    onClick={() => navigate(`/dashboard/report/${report.id}`)}
                  >
                    View Log
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScanECG;
