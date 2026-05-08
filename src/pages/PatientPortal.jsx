import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Phone, FileText, Download, CheckCircle, Clock } from 'lucide-react';
import { api } from '../services/api';
import './PatientPortal.css';

const PatientPortal = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [reportId, setReportId] = useState(queryParams.get('reportId') || '');
  const [mobile, setMobile] = useState(queryParams.get('mobile') || '');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reportId && mobile) {
      handleSearch(null, true);
    }
  }, []);

  const handleSearch = async (e, isAuto = false) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setReport(null);

    try {
      const data = await api.publicSearch(reportId, mobile);
      setReport(data.report);
    } catch (err) {
      setError(err.message || 'Report not found or not yet approved by doctor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-portal">
      <div className="portal-header">
        <h1>Patient Result Portal</h1>
        <p>Access your medical reports and prescriptions securely</p>
      </div>

      <div className="search-section card animate-slide-in">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-inputs">
            <div className="input-group">
              <label>Report ID</label>
              <div className="input-wrapper">
                <FileText size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. report_abcd1234"
                  value={reportId}
                  onChange={(e) => setReportId(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label>Mobile Number</label>
              <div className="input-wrapper">
                <Phone size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. 017xxxxxxxx"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <button type="submit" className="btn-primary search-btn" disabled={loading}>
            <Search size={20} />
            <span>{loading ? 'Searching...' : 'Find My Report'}</span>
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>

      {report && (
        <div className="report-display animate-scale-in">
          <div className="report-summary card">
            <div className="flex-between">
              <div>
                <h2>ECG Diagnosis Report</h2>
                <span className="report-date">Date: {new Date(report.created_at).toLocaleDateString()}</span>
              </div>
              <div className="status-badge approved">
                <CheckCircle size={16} />
                <span>Doctor Approved</span>
              </div>
            </div>

            <div className="result-grid">
              <div className="result-item">
                <label>Patient Name</label>
                <p>{report.patient_name}</p>
              </div>
              <div className="result-item">
                <label>Risk Evaluation</label>
                <p className={`risk-text ${report.risk_level.toLowerCase()}`}>{report.risk_level}</p>
              </div>
            </div>

            <div className="observation-box">
              <h3>Doctor's Observations</h3>
              <p>{report.observations}</p>
            </div>

            {report.prescription && (
              <div className="prescription-box">
                <h3>Prescription</h3>
                <div className="prescription-content">
                  {report.prescription}
                </div>
              </div>
            )}

            <button className="btn-outline print-btn" onClick={() => window.print()}>
              <Download size={18} />
              <span>Download PDF Report</span>
            </button>
          </div>
        </div>
      )}

      {!report && !loading && (
        <div className="portal-info animate-fade-in">
          <div className="info-card">
            <Clock size={24} color="#7c4dff" />
            <h3>Waiting for results?</h3>
            <p>Reports are usually available within 2 hours after scanning. Your doctor will review the AI findings before publishing the final report.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientPortal;
