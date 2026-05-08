import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Users, FileText, ClipboardList, HelpCircle, LogOut, HeartPulse } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Scan New ECG', path: '/scan', icon: <HeartPulse size={20} /> },
    { name: 'Patient Records', path: '/patients', icon: <Users size={20} /> },
    { name: 'Lab Reports', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Prescriptions', path: '/prescriptions', icon: <ClipboardList size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon flex-center">
          <Activity size={24} color="white" />
        </div>
        <div className="logo-text">
          <h2>Medical Center</h2>
          <span>Diagnostic Wing</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item btn-transparent">
          <HelpCircle size={20} />
          <span>Support</span>
        </button>
        <button className="nav-item btn-transparent text-danger">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
