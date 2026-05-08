import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './Layout.css';

const Layout = ({ children, user, onLogout }) => {
  return (
    <div className="layout-container">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="main-wrapper">
        <Topbar user={user} />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
