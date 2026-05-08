import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Users, FileText, ClipboardList, HelpCircle, LogOut, HeartPulse, Settings, Scan } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ user, onLogout }) => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/', roles: ['doctor', 'lab-assistant'] },
    { icon: <Scan size={20} />, label: 'Scan New ECG', path: '/scan', roles: ['doctor', 'lab-assistant'] },
    { icon: <FileText size={20} />, label: 'Lab Reports', path: '/reports', roles: ['doctor', 'lab-assistant'] },
    { icon: <ClipboardList size={20} />, label: 'Prescriptions', path: '/prescriptions', roles: ['doctor'] },
    { icon: <Users size={20} />, label: 'Patient Records', path: '/patients', roles: ['doctor'] },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings', roles: ['doctor', 'lab-assistant'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <Activity color="white" size={24} />
        </div>
        <span className="logo-text">Heart+</span>
      </div>

      <nav className="sidebar-nav">
        {filteredMenu.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {user.name.charAt(0)}
          </div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role === 'doctor' ? 'Medical Doctor' : 'Lab Technician'}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
