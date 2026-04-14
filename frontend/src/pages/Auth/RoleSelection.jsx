import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      {/* Header */}
      <header className="auth-header">
        <Link to="/" className="auth-logo">
          <img 
            src="/assets/logo.png" 
            alt="Logo" 
            className="auth-logo-img" 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <span style={{ display: 'none', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>BKAttendance</span>
        </Link>
      </header>

      {/* Body */}
      <main className="auth-body">
        <div className="auth-roles-container">
          {/* Giảng viên Card */}
          <div className="auth-role-card" onClick={() => navigate('/login', { state: { role: 'lecturer' } })}>
            <img 
              src="/assets/lecturer.png" 
              alt="Giảng viên" 
              className="auth-role-icon" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback Icon */}
            <div style={{ display: 'none', width: '120px', height: '120px', marginBottom: '30px', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e2a300', borderRadius: '50%', fontSize: '3rem' }}>
              👨‍🏫
            </div>
            <span className="auth-role-title">Giảng viên</span>
          </div>

          {/* Admin Card */}
          <div className="auth-role-card" onClick={() => navigate('/login', { state: { role: 'admin' } })}>
            <img 
              src="/assets/admin.png" 
              alt="Admin" 
              className="auth-role-icon" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback Icon */}
            <div style={{ display: 'none', width: '120px', height: '120px', marginBottom: '30px', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e2a300', borderRadius: '50%', fontSize: '3rem' }}>
              ⚙️
            </div>
            <span className="auth-role-title">Admin</span>
          </div>
        </div>
      </main>
    </div>
  );
}
