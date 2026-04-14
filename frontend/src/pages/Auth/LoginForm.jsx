import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRole = location.state?.role || null;

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'gv@hcmut.edu.vn' && password === '123456') {
      if (selectedRole && selectedRole !== 'lecturer') {
        alert('Tài khoản không có quyền truy cập với vai trò này');
        return;
      }
      localStorage.setItem('role', 'lecturer');
      navigate('/lecturer');
    } else if (email === 'admin@hcmut.edu.vn' && password === '123456') {
      if (selectedRole && selectedRole !== 'admin') {
        alert('Tài khoản không có quyền truy cập với vai trò này');
        return;
      }
      localStorage.setItem('role', 'admin');
      navigate('/admin');
    } else {
      alert('Sai email hoặc mật khẩu!');
    }
  };

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
        <form className="auth-login-form-container" onSubmit={handleLogin}>
          <div className="auth-form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="admin@hcmut.edu.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input 
              type="password" 
              id="password" 
              placeholder="*****" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            Đăng nhập
          </button>

          <Link to="#" className="auth-forgot-link">
            Quên mật khẩu?
          </Link>
        </form>
      </main>
    </div>
  );
}
