import React, { useEffect, useState } from 'react';
import { ChevronLeft, Share2, MoreVertical, Printer, Send, Activity, Info, AlertTriangle, RotateCcw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Waveform from '../components/Waveform';
import Gauge from '../components/Gauge';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';
import './DiagnosticDetail.css';

const DiagnosticDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await api.getReportDetail(id);
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="flex-center" style={{ height: '80vh' }}><h3>Loading Report Detail...</h3></div>;
  if (!report) return <div className="flex-center" style={{ height: '80vh' }}><h3>Report Not Found</h3></div>;

  const biomarkers = JSON.parse(report.biomarkers || '[]');

  return (
    <div className="diagnostic-detail animate-slide-in">
      <div className="breadcrumb">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ChevronLeft size={18} />
          <span>Lab Reports</span>
        </button>
        <span className="separator">/</span>
        <span className="current">REPORT #{report.id}</span>
      </div>

      <div className="detail-header flex-between">
        <div className="patient-info-summary">
          <h1>ECG Diagnostic Detail</h1>
          <div className="meta">
            <span>Patient: <strong>{report.patient_name}</strong></span>
            <span className="dot-sep"></span>
            <span>ID: {report.patient_id}</span>
            <span className="dot-sep"></span>
            <span>Date: {new Date(report.upload_time).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="header-actions">
          <StatusBadge type={report.status} />
          <button className="icon-btn"><Share2 size={18} /></button>
          <button className="icon-btn"><MoreVertical size={18} /></button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="main-report card">
          <div className="card-header flex-between">
            <h3 className="flex-center" style={{ gap: '0.5rem' }}>
              <Activity size={18} /> Digitized ECG Waveform (Lead II)
            </h3>
          </div>
          <div className="waveform-display">
            <Waveform height={350} color="#dc3545" />
          </div>
          <div className="vitals-grid">
            <div className="vital-item">
              <span className="label">HEART RATE</span>
              <span className="value">94 <span className="unit">BPM</span></span>
            </div>
            <div className="vital-item">
              <span className="label">PR INTERVAL</span>
              <span className="value">162 <span className="unit">ms</span></span>
            </div>
            <div className="vital-item">
              <span className="label">QRS DURATION</span>
              <span className="value">88 <span className="unit">ms</span></span>
            </div>
            <div className="vital-item">
              <span className="label">QT/QTc</span>
              <span className="value">340/412 <span className="unit">ms</span></span>
            </div>
          </div>
        </div>

        <div className="ai-report-sidebar">
          <div className="ai-card card">
            <div className="card-header flex-between">
              <h3 className="flex-center" style={{ gap: '0.5rem' }}>
                 AI Assumption Card
              </h3>
              <span className="engine-label">ENGINE V4.2.0</span>
            </div>
            <div className="ai-content flex-center" style={{ flexDirection: 'column', padding: '1rem 0' }}>
              <Gauge value={report.confidence_score} label="Heart Attack Probability" />
              <p className={`risk-level ${report.risk_level === 'HIGH RISK' ? 'text-danger' : 'text-success'}`}>
                {report.risk_level}
              </p>
            </div>
            <div className="ai-observation-box">
              <div className="obs-header flex-center" style={{ gap: '0.5rem' }}>
                <AlertTriangle size={16} />
                <span>AI OBSERVATION</span>
              </div>
              <p>{report.observations}</p>
            </div>
            <div className="ai-meta">
              <div className="flex-between">
                <span>Confidence Score</span>
                <span className="font-600">{report.confidence_score}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${report.confidence_score}%` }}></div>
              </div>
            </div>
            <div className="biomarkers">
              {biomarkers.map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="physician-guidance card">
            <h3>Physician Guidance</h3>
            <p>The AI model detects patterns consistent with Inferior Wall MI. Protocol 402 is recommended for immediate treatment path initialization.</p>
            <button className="btn-outline" style={{ width: '100%', marginTop: '1rem' }}>
              VIEW CLINICAL PROTOCOLS
            </button>
          </div>
        </div>
      </div>

      <div className="observations-grid">
        <div className="card">
          <h3 className="flex-center" style={{ gap: '0.5rem' }}>
            <RotateCcw size={18} /> Patient Baseline
          </h3>
          <p className="mt-1">Previous ECG (Jan 12, 2023) showed normal sinus rhythm. Comparison highlights a marked shift in the ST-segment morphology in the inferior leads.</p>
        </div>
        <div className="card">
          <h3 className="flex-center" style={{ gap: '0.5rem' }}>
            <Info size={18} /> Tech Observations
          </h3>
          <ul className="obs-list mt-1">
            <li>Lead placement verified by technician.</li>
            <li>No motion artifacts detected during scan.</li>
            <li className="text-danger">Patient reported mild chest pressure.</li>
          </ul>
        </div>
      </div>

      <div className="page-footer card flex-between">
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
           Report verified by automated diagnostic systems. Awaiting human signature.
        </p>
        <div className="footer-actions">
          <button className="btn-outline" onClick={() => window.print()}>
            <Printer size={18} />
            <span>Print for Lab Records</span>
          </button>
          <button className="btn-primary">
            <Send size={18} />
            <span>Send to Patient & Doctor</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticDetail;
