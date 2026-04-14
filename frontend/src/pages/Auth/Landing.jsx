import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      {/* Header */}
      <header className="auth-header">
        <div className="auth-logo">
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
        </div>
        <Link to="/roles" className="auth-header-login-link">
          Đăng nhập
        </Link>
      </header>

      {/* Body */}
      <main className="auth-body">
        <div style={{ textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <img 
            src="/assets/BKAttendance.png" 
            alt="BKAttendance Background" 
            className="auth-landing-img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div style={{ display: 'none', fontSize: '2.5rem', fontWeight: 'bold', color: '#096395' }}>
            [BKAttendance.png]
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        © {new Date().getFullYear()} BKAttendance System. All rights reserved.
      </footer>
    </div>
  );
}
