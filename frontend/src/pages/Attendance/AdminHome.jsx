import React from 'react';
import './Attendance.css';

export default function AdminHome() {
  return (
    <div className="content-container flex-1 w-full h-full">
      <div className="home-card flex-1 flex items-center justify-center h-full w-full">
        <div style={{ textAlign: 'center' }}>
          <img 
            src="/assets/BKAttendance.png" 
            alt="BKAttendance Admin" 
            className="home-img"
            style={{ maxWidth: '400px', height: 'auto' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div style={{ display: 'none', fontSize: '2.5rem', fontWeight: 'bold', color: '#096395' }}>
            [BKAttendance Logo]
          </div>
        </div>
      </div>
    </div>
  );
}
