import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ type, text }) => {
  // type can be: critical, stable, processing, archived
  const badgeClass = `status-badge ${type}`;
  
  return (
    <span className={badgeClass}>
      <span className="dot"></span>
      {text || type.toUpperCase()}
    </span>
  );
};

export default StatusBadge;
