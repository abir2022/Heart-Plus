import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Waveform.css';

const Waveform = ({ data, color = "#0b5ed7", height = 200 }) => {
  // Generate mock ECG data if none provided
  const mockData = data || Array.from({ length: 100 }, (_, i) => ({
    time: i,
    value: Math.sin(i * 0.5) * 2 + (i % 10 === 0 ? 10 : 0) + (Math.random() * 0.5)
  }));

  return (
    <div className="waveform-container" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
          <XAxis dataKey="time" hide />
          <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            labelStyle={{ display: 'none' }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2} 
            dot={false}
            animationDuration={2000}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Waveform;
