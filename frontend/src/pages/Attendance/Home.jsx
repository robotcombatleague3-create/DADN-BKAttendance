import React from 'react';
import './Attendance.css';

export default function Home() {
  return (
    <div className="content-container">
      <div className="home-card">
        <div style={{ textAlign: 'center' }}>
          <img 
            src="/assets/BKAttendance.png" 
            alt="BKAttendance" 
            className="home-img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div style={{ display: 'none', fontSize: '2rem', fontWeight: 'bold', color: '#096395' }}>
            [BKAttendance Image Placeholder]
          </div>
        </div>
      </div>
    </div>
  );
}
