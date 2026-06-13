import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../services/api';
import './Auth.css';

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRole = location.state?.role || null;

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      if (data.success) {
        const { role, userId, name, token } = data.data;

        // Check if role matches what they selected
        if (selectedRole && role !== selectedRole) {
          alert('Tài khoản không có quyền truy cập với vai trò này');
          return;
        }

        // Store role and userId in localStorage
        localStorage.setItem('role', role);
        localStorage.setItem('userId', userId); // Useful for lecturer profile
        localStorage.setItem('userName', name); // Store user's name
        if (token) localStorage.setItem('token', token); // Store JWT token

        // Route based on role
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'lecturer') {
          navigate('/lecturer');
        } else {
          alert('Vai trò không hợp lệ');
        }
      } else {
        alert(data.message || 'Sai email hoặc mật khẩu!');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Lỗi kết nối đến máy chủ');
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
