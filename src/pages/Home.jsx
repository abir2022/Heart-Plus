import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Search, Calendar, Stethoscope, Microscope, 
  Heart, ShieldCheck, Clock, Phone, Mail, MapPin, 
  ArrowRight, CheckCircle, ChevronRight, Zap
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const [reportId, setReportId] = useState('');
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/patient-portal?reportId=${reportId}&mobile=${mobile}`);
  };

  const doctors = [
    { name: 'Dr. Sarah Chen', role: 'Chief Cardiologist', specialty: 'Interventional Cardiology', image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=300&h=300' },
    { name: 'Dr. James Wilson', role: 'Cardiac Surgeon', specialty: 'Advanced Heart Surgery', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300' },
    { name: 'Dr. Elena Rodriguez', role: 'Emergency Lead', specialty: 'Emergency Medicine', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300' },
    { name: 'Dr. Marcus Thorne', role: 'Neuro-Cardiologist', specialty: 'Neurological Imaging', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300' },
    { name: 'Dr. Priya Sharma', role: 'Internal Medicine', specialty: 'Diagnostic Medicine', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300' },
  ];

  return (
    <div className="home-container">
      {/* Top Navigation Bar */}
      <nav className="home-nav">
        <div className="nav-content">
          <div className="logo">
            <Activity color="#2563eb" size={32} />
            <span>Heart+ Medical</span>
          </div>
          <div className="nav-links">
            <a href="#specialties">Specialties</a>
            <a href="#diagnostics">Diagnostics</a>
            <a href="#facilities">Facilities</a>
            <a href="#about">About Us</a>
          </div>
          <div className="nav-actions">
            <button className="btn-secondary" onClick={() => navigate('/login')}>Doctor Login</button>
            <button className="btn-primary" onClick={() => document.getElementById('report-checker').scrollIntoView({ behavior: 'smooth' })}>Check Report</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content animate-slide-up">
          <span className="hero-badge">Next-Gen Medical Analysis</span>
          <h1>Precision Healthcare Excellence</h1>
          <p>Advanced AI-powered diagnostics and compassionate care at your fingertips. Experience clinical precision with a human touch.</p>
          <div className="hero-btns">
            <button className="btn-primary-lg" onClick={() => document.getElementById('report-checker').scrollIntoView({ behavior: 'smooth' })}>
              Check your report <ArrowRight size={20} />
            </button>
            <button className="btn-outline-lg">Book an Appointment</button>
          </div>
        </div>
      </section>

      {/* Report Checker Section */}
      <section id="report-checker" className="report-checker-section">
        <div className="checker-card animate-scale-in">
          <div className="checker-info">
            <h2>Instant Report Access</h2>
            <p>Access your diagnostic results securely from anywhere. Our laboratory system ensures your data remains private and easily accessible.</p>
          </div>
          <form onSubmit={handleSearch} className="checker-form">
            <div className="form-grid">
              <div className="input-field">
                <label>PATIENT ID / REPORT ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. report_abcd1234"
                  value={reportId}
                  onChange={(e) => setReportId(e.target.value)}
                  required
                />
              </div>
              <div className="input-field">
                <label>MOBILE NUMBER</label>
                <input 
                  type="text" 
                  placeholder="e.g. 017xxxxxxxx"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary search-btn">
              <Search size={20} /> Retrieve Patient Report
            </button>
          </form>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="specialties" className="doctors-section">
        <div className="section-header">
          <h2>Our Expert Medical Faculty</h2>
          <p>Dedicated professionals with decades of clinical expertise.</p>
        </div>
        <div className="doctors-grid">
          {doctors.map((doc, i) => (
            <div key={i} className="doctor-card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="doctor-image">
                <img src={doc.image} alt={doc.name} />
              </div>
              <div className="doctor-info">
                <h3>{doc.name}</h3>
                <span className="doc-role">{doc.role}</span>
                <p>{doc.specialty}</p>
                <button className="btn-text">View Profile <ChevronRight size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Facilities Section */}
      <section id="diagnostics" className="facilities-section">
        <div className="facility-group">
          <div className="facility-title">
            <div className="title-line"></div>
            <h2>DIAGNOSTIC FACILITIES</h2>
          </div>
          <div className="facility-grid">
            <div className="facility-card">
              <Microscope className="facility-icon" />
              <h4>Blood Labs</h4>
              <p>Automated pathology labs for precise blood analysis and chemistry.</p>
            </div>
            <div className="facility-card">
              <Zap className="facility-icon" />
              <h4>Advanced Imaging</h4>
              <p>Ultra-high resolution MRI and CT scanning capabilities.</p>
            </div>
            <div className="facility-card">
              <Activity className="facility-icon" />
              <h4>ECG/EEG</h4>
              <p>Continuous cardiac and neurological activity monitoring units.</p>
            </div>
            <div className="facility-card">
              <ShieldCheck className="facility-icon" />
              <h4>Genetic Testing</h4>
              <p>Advanced molecular diagnostics for hereditary conditions.</p>
            </div>
          </div>
        </div>

        <div id="facilities" className="facility-group second">
          <div className="facility-title right">
            <h2>HOSPITAL FACILITIES</h2>
            <div className="title-line"></div>
          </div>
          <div className="facility-grid">
            <div className="facility-card hospital">
              <Heart className="facility-icon red" />
              <h4>24/7 Emergency</h4>
              <p>Round-the-clock emergency response with trauma-specialized staff.</p>
            </div>
            <div className="facility-card hospital">
              <Stethoscope className="facility-icon red" />
              <h4>ICU Units</h4>
              <p>State-of-the-art intensive care with dedicated monitoring.</p>
            </div>
            <div className="facility-card hospital">
              <Activity className="facility-icon red" />
              <h4>Maternity</h4>
              <p>Comprehensive mother and newborn care in a comfortable environment.</p>
            </div>
            <div className="facility-card hospital">
              <Zap className="facility-icon red" />
              <h4>Rehabilitation</h4>
              <p>Specialized physical therapy and post-operative recovery center.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stat-card blue">
          <h3>Diagnostic Impact</h3>
          <div className="stat-grid">
            <div className="stat-item">
              <span className="stat-value">99.8%</span>
              <span className="stat-label">REPORT ACCURACY</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">250k+</span>
              <span className="stat-label">ANNUAL TESTS</span>
            </div>
          </div>
        </div>
        <div className="stat-card red">
          <Clock className="stat-icon" />
          <div className="stat-content">
            <span className="stat-value">15 Min</span>
            <span className="stat-label">Average Emergency Response Time</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Heart+ Medical</h3>
            <p>Providing precision healthcare and advanced diagnostics to the community since 1994.</p>
          </div>
          <div className="footer-links">
            <h4>QUICK LINKS</h4>
            <a href="#">Specialties</a>
            <a href="#">Diagnostics</a>
            <a href="#">Facilities</a>
          </div>
          <div className="footer-links">
            <h4>LEGAL & CAREERS</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Patient Rights</a>
          </div>
          <div className="footer-contact">
            <h4>EMERGENCY</h4>
            <div className="emergency-box">
              <Phone size={20} />
              <div>
                <span className="phone">1-800-VITALS</span>
                <span className="note">24/7 HELPLINE</span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Vitals Lab Medical Center. All rights reserved. Precision Healthcare Excellence.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
