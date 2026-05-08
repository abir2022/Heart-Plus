import React from 'react';
import { Search, Bell, Settings, User } from 'lucide-react';
import './Topbar.css';

const Topbar = () => {
  return (
    <header className="topbar">
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search Patients by Name or Hospital ID..." 
          className="search-input"
        />
      </div>
      
      <div className="topbar-actions">
        <button className="action-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <button className="action-btn">
          <Settings size={20} />
        </button>
        
        <div className="divider"></div>
        
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">Dr. Sarah Chen</span>
            <span className="user-role">Lab Supervisor</span>
          </div>
          <div className="user-avatar">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
