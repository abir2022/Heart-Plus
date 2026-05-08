import React from 'react';
import { Search, Bell, Settings, User } from 'lucide-react';
import './Topbar.css';

const Topbar = () => {
  return (
    <header className="topbar">
      <div className="search-container">
        <Search size={18} className="search-icon" />
    <header className="topbar card">
      <div className="search-bar">
        <Search size={18} />
        <input type="text" placeholder="Search patients, reports, or records..." />
      </div>

      <div className="topbar-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <div className="divider"></div>
        <div className="user-profile-sm">
          <div className="user-info text-right">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          <div className="user-avatar-sm">
            {user?.name?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
