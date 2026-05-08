import React, { useEffect, useState } from 'react';
import './Gauge.css';

const Gauge = ({ value, label = "Risk Score" }) => {
  const [offset, setOffset] = useState(0);
  const radius = 70;
  const circumference = radius * Math.PI; // Semi-circle
  
  useEffect(() => {
    const progress = value / 100;
    const dashOffset = circumference * (1 - progress);
    setOffset(dashOffset);
  }, [value, circumference]);

  const getColor = (val) => {
    if (val > 70) return 'var(--status-critical)';
    if (val > 30) return 'var(--status-processing)';
    return 'var(--status-stable)';
  };

  return (
    <div className="gauge-container">
      <svg className="gauge" width="180" height="110">
        <path
          className="gauge-bg"
          d="M 20 100 A 70 70 0 0 1 160 100"
          strokeWidth="12"
          fill="none"
          stroke="#e9ecef"
          strokeLinecap="round"
        />
        <path
          className="gauge-progress"
          d="M 20 100 A 70 70 0 0 1 160 100"
          strokeWidth="12"
          fill="none"
          stroke={getColor(value)}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="gauge-text">
        <span className="gauge-value">{value}%</span>
        <span className="gauge-label">{label}</span>
      </div>
    </div>
  );
};

export default Gauge;
