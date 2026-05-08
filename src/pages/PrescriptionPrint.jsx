import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Activity, Phone, Calendar, User, FileText, Hash, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import './PrescriptionPrint.css';

const PrescriptionPrint = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await api.getReportDetail(id);
        setReport(data);
        // Automatically trigger print dialog after a short delay
        setTimeout(() => window.print(), 1000);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="print-loading">Preparing Medical Document...</div>;
  if (!report) return <div>Document Not Found</div>;

  return (
    <div className="print-document">
      {/* Hospital Letterhead */}
      <header className="print-header">
        <div className="hospital-brand">
          <div className="logo-circle">
            <Activity size={32} color="white" />
          </div>
          <div className="brand-text">
            <h1>Heart+ Medical Center</h1>
            <p>Advanced Diagnostic & Cardiac Research Institute</p>
          </div>
        </div>
        <div className="hospital-contact">
          <p>123 Medical Avenue, Healthcare City</p>
          <p>Emergency: 1-800-VITALS</p>
          <p>www.heartplus-medical.com</p>
        </div>
      </header>

      <div className="print-divider"></div>

      {/* Patient & Report Info */}
      <section className="print-section patient-info-grid">
        <div className="info-item">
          <label>Patient Name</label>
          <p>{report.patient_name}</p>
        </div>
        <div className="info-item">
          <label>Age / Gender</label>
          <p>{report.age} Years / {report.gender}</p>
        </div>
        <div className="info-item">
          <label>Contact Number</label>
          <p>{report.mobile}</p>
        </div>
        <div className="info-item">
          <label>Date of Issue</label>
          <p>{new Date(report.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      </section>

      <section className="print-section report-meta">
        <div className="meta-item">
          <Hash size={14} /> <span>Report ID: {report.id}</span>
        </div>
        <div className="meta-item">
          <FileText size={14} /> <span>Status: {report.status.toUpperCase()}</span>
        </div>
      </section>

      <div className="print-divider-thin"></div>

      {/* AI Diagnostic Summary */}
      <section className="print-section">
        <h2 className="section-title">AI DIAGNOSTIC SUMMARY</h2>
        <div className="ai-box-print">
          <div className="ai-metrics">
            <div className="metric">
              <span className="label">Cardiac Risk Level</span>
              <span className={`value ${report.risk_level?.toLowerCase()}`}>{report.risk_level || 'STABLE'}</span>
            </div>
            <div className="metric">
              <span className="label">Analysis Confidence</span>
              <span className="value">{report.confidence_score}%</span>
            </div>
          </div>
          <p className="observations"><strong>Observations:</strong> {report.observations}</p>
        </div>
      </section>

      {/* Official Prescription */}
      <section className="print-section prescription-area">
        <h2 className="section-title">PHYSICIAN'S PRESCRIPTION & ADVICE</h2>
        <div className="prescription-content">
          <div className="pres-group">
            <h3>DIAGNOSIS:</h3>
            <p className="diagnosis-text">{report.diagnosis || 'Clinical evaluation pending final physician signature.'}</p>
          </div>
          
          <div className="pres-group">
            <h3>MEDICATIONS & DOSAGE:</h3>
            <div className="medications-list">
              {report.medications ? (
                <p>{report.medications}</p>
              ) : (
                <p className="placeholder">No medications prescribed yet.</p>
              )}
            </div>
          </div>

          <div className="pres-group">
            <h3>PHYSICIAN NOTES:</h3>
            <p>{report.notes || 'Routine follow-up advised in 2 weeks.'}</p>
          </div>
        </div>
      </section>

      {/* Footer & Signature */}
      <footer className="print-footer">
        <div className="signature-area">
          <div className="sig-line"></div>
          <p>Authorized Physician Signature</p>
          <p className="doc-name">Dr. Sarah Chen, MBBS, MD (Cardiology)</p>
        </div>
        <div className="print-disclaimer">
          <p>This is a computer-generated medical document. Validated by Heart+ AI Diagnostic Engine v4.2.0.</p>
          <p>In case of emergency, please contact our 24/7 helpline immediately.</p>
        </div>
      </footer>

      {/* Hidden instructions for non-print view */}
      <div className="no-print-tip">
        <p>Generating Print Preview... If the dialog doesn't appear, press <strong>Ctrl + P</strong></p>
        <button onClick={() => window.close()} className="btn-close">Close Preview</button>
      </div>
    </div>
  );
};

export default PrescriptionPrint;
