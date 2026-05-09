import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Phone, FileText, Download, CheckCircle, Clock, Printer } from 'lucide-react';
import { api } from '../services/api';
import './PatientPortal.css';

const PatientPortal = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [reportId, setReportId] = useState(queryParams.get('reportId') || '');
  const [mobile, setMobile] = useState(queryParams.get('mobile') || '');
  const [report, setReport] = useState(null);
  const [reportsList, setReportsList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mobile) {
      handleSearch(null, true);
    }
  }, []);

  const handleSearch = async (e, isAuto = false) => {
    if (e) e.preventDefault();
    if (!mobile && !reportId) { setError('Please enter a Report ID or Mobile Number.'); return; }
    setLoading(true);
    setError('');
    setReport(null);
    setReportsList([]);

    try {
      const data = await api.publicSearch(reportId, mobile);
      if (data.report) {
        setReport(data.report);
      } else if (data.reports) {
        setReportsList(data.reports);
      }
    } catch (err) {
      setError(err.message || 'No records found.');
    } finally {
      setLoading(false);
    }
  };

  const selectReport = (id) => {
    setReportId(id);
    // Use mobile if available, otherwise search by ID alone
    setTimeout(async () => {
      setLoading(true);
      setError('');
      setReport(null);
      try {
        const data = await api.publicSearch(id, mobile);
        if (data.report) setReport(data.report);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 50);
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
      </div>

      <div className="portal-content">
        {loading ? (
          <div className="portal-loading flex-center">
            <div className="loader"></div>
            <p>Searching Medical Database...</p>
          </div>
        ) : error ? (
          <div className="portal-error card animate-shake">
            <p>{error}</p>
          </div>
        ) : reportsList.length > 0 ? (
          <div className="reports-list card animate-slide-up">
            <h3>Diagnostic History</h3>
            <p className="subtitle">Found {reportsList.length} report(s) for this mobile number.</p>
            <div className="list-items">
              {reportsList.map((rep) => (
                <div
                  key={rep.id}
                  className={`list-item flex-between ${rep.is_approved ? 'clickable' : 'pending-item'}`}
                  onClick={() => rep.is_approved ? selectReport(rep.id) : null}
                >
                  <div className="item-main">
                    <span className="report-date">
                      {new Date(rep.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="report-id-badge">{rep.id}</span>
                  </div>
                  <div className="item-action">
                    {rep.is_approved ? (
                      <button className="btn-text">View Report <Search size={14} /></button>
                    ) : (
                      <span className="pending-badge">⏳ Pending Doctor Review</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : report ? (
          <div className="report-display animate-slide-up">
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
              <div className="flex-between">
                <div>
                  <span className="badge-primary">OFFICIAL REPORT</span>
                  <h1>{report.patient_name}'s Diagnosis</h1>
                </div>
                <button 
                  className="btn-outline flex-center" 
                  style={{ gap: '0.5rem' }}
                  onClick={() => window.open(`/print/${report.id}`, '_blank')}
                >
                  <Printer size={18} />
                  <span>Print PDF</span>
                </button>
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
        ) : null}
      </div>

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
