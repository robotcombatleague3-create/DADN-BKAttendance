import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import './MainLayout.css';

export default function MainLayout({ role = 'admin' }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/');
  };

  const homePath = role === 'admin' ? '/admin' : '/lecturer';

  return (
    <div className="main-layout min-vh-100 d-flex flex-column w-100">
      {/* Topbar */}
      <header className="main-topbar d-flex justify-content-between align-items-center">
        <div className="topbar-left">
          <Link to={homePath} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img 
              src="/assets/logo.png" 
              alt="Logo" 
              className="topbar-logo-img" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span style={{ display: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>BKAttendance</span>
          </Link>
        </div>

        <nav className="topbar-center">
          <NavLink to={`/${role}/home`} className={({ isActive }) => Math.max(0, isActive) || window.location.pathname.startsWith(`/${role}/home`) ? "topbar-nav-link active" : "topbar-nav-link"}>
            Trang chủ
          </NavLink>
          <NavLink to={`/${role}/attendance`} className={({ isActive }) => Math.max(0, isActive) || window.location.pathname.startsWith(`/${role}/attendance`) ? "topbar-nav-link active" : "topbar-nav-link"}>
            Điểm danh
          </NavLink>
          <NavLink to={`/${role}/students`} className={({ isActive }) => Math.max(0, isActive) || window.location.pathname.startsWith(`/${role}/students`) ? "topbar-nav-link active" : "topbar-nav-link"}>
            Sinh viên
          </NavLink>
          {role === 'admin' && (
            <NavLink to={`/${role}/lecturers`} className={({ isActive }) => Math.max(0, isActive) || window.location.pathname.startsWith(`/${role}/lecturers`) ? "topbar-nav-link active" : "topbar-nav-link"}>
              Giảng viên
            </NavLink>
          )}
        </nav>

        <div className="topbar-right d-flex align-items-center" style={{ gap: '20px' }}>
          <Bell className="topbar-bell-icon" size={22} color="white" cursor="pointer" />
          
          {/* Bootstrap Dropdown */}
          <div className="dropdown" style={{ position: 'relative' }}>
            <div 
              className="topbar-user-info d-flex align-items-center" 
              style={{ cursor: 'pointer', gap: '10px' }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="topbar-user-name" style={{ color: 'white', fontWeight: 500 }}>
                {role === 'admin' ? 'Admin: Phan T' : 'GV: Trần Thị A'}
              </span>
              <div 
                className="topbar-avatar" 
                style={{ 
                  backgroundColor: role === 'admin' ? '#22c55e' : '#fbcfe8', 
                  color: role === 'admin' ? 'white' : '#be185d', 
                  width: '36px', height: '36px', borderRadius: '50%', 
                  display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' 
                }}
              >
                {role === 'admin' ? 'T' : 'A'}
              </div>
            </div>
            
            {showDropdown && (
              <ul className="dropdown-menu show" style={{ position: 'absolute', right: 0, top: '100%', marginTop: '0.5rem' }}>
                <li>
                  <Link to={`/${role}/profile`} className="dropdown-item" onClick={() => setShowDropdown(false)}>Hồ sơ</Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>Đăng xuất</button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="main-body flex-grow-1 d-flex flex-column w-100 h-100">
        {/* Nơi chứa nội dung các trang con (Home, AttendanceList, v.v) */}
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="main-footer">
        © {new Date().getFullYear()} BKAttendance System. All rights reserved.
      </footer>
    </div>
  );
}
