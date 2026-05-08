import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, FileCheck, AlertCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const stats = [
    { title: 'Total Scans', value: '1,284', icon: <Activity />, color: 'blue' },
    { title: 'New Patients', value: '42', icon: <Users />, color: 'green' },
    { title: 'AI Evaluated', value: '856', icon: <FileCheck />, color: 'purple' },
    { title: 'Urgent Cases', value: '12', icon: <AlertCircle />, color: 'red' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header flex-between">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="subtitle">Welcome back, Dr. Chen. Here's what's happening today.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/dashboard/scan')}>
          <Activity size={18} />
          <span>New Scan</span>
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card card">
            <div className={`stat-icon ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-title">{stat.title}</span>
              <h2 className="stat-value">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="card recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-placeholder">
            <p>Activity logs will appear here once the system is fully operational.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
