import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { io } from 'socket.io-client';
import './MainLayout.css';

export default function MainLayout({ role = 'admin' }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Observer Pattern: Lắng nghe sự kiện quét thẻ điểm danh real-time
    if (role === 'lecturer' || role === 'admin') {
      const socket = io('http://localhost:3000');
      
      socket.on('new_attendance', (data) => {
        const newNotif = {
          id: Date.now() + Math.random(),
          title: 'Điểm danh mới',
          message: `SV: ${data.name} (${data.student_code}) - ${data.status === 'Present' ? 'Có mặt' : data.status === 'Late' ? 'Đi trễ' : 'Vắng'}`,
          time: new Date().toLocaleTimeString('vi-VN'),
          showToast: true,
        };

        setNotifications(prev => [newNotif, ...prev]);

        // Ẩn dạng thông báo (toast) sau 10 giây
        setTimeout(() => {
          setNotifications(prev => 
            prev.map(n => n.id === newNotif.id ? { ...n, showToast: false } : n)
          );
        }, 10000);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    navigate('/');
  };

  const homePath = role === 'admin' ? '/admin' : '/lecturer';
  const userName = localStorage.getItem('userName') || (role === 'admin' ? 'Admin: Phan T' : 'GV: Trần Thị A');
  const userInitials = userName.trim().split(' ').pop().charAt(0).toUpperCase();

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

        <div className="topbar-right d-flex align-items-center" style={{ gap: '25px' }}>
          
          {/* Bell Icon for Notifications */}
          <div className="dropdown" style={{ position: 'relative' }}>
            <div className="position-relative" style={{ cursor: 'pointer' }} onClick={() => setShowBellDropdown(!showBellDropdown)}>
              <Bell className="topbar-bell-icon" size={22} color="white" />
              {notifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                  {notifications.length}
                </span>
              )}
            </div>
            
            {showBellDropdown && (
              <div className="dropdown-menu show shadow" style={{ position: 'absolute', right: 0, top: '100%', marginTop: '1rem', width: '320px', maxHeight: '400px', overflowY: 'auto' }}>
                <h6 className="dropdown-header">Thông báo điểm danh</h6>
                {notifications.length === 0 ? (
                  <div className="dropdown-item text-muted text-center py-3">Không có thông báo nào</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="dropdown-item border-bottom py-2" style={{ whiteSpace: 'normal' }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong className="text-primary" style={{ fontSize: '0.85rem' }}>{n.title}</strong>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>{n.time}</small>
                      </div>
                      <div style={{ fontSize: '0.85rem' }}>{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="dropdown" style={{ position: 'relative' }}>
            <div 
              className="topbar-user-info d-flex align-items-center" 
              style={{ cursor: 'pointer', gap: '10px' }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="topbar-user-name" style={{ color: 'white', fontWeight: 500 }}>
                {userName}
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
                {userInitials}
              </div>
            </div>
            
            {showDropdown && (
              <ul className="dropdown-menu show shadow" style={{ position: 'absolute', right: 0, top: '100%', marginTop: '0.5rem' }}>
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
      <main className="main-body flex-grow-1 d-flex flex-column w-100 h-100 position-relative">
        {/* Nơi chứa nội dung các trang con (Home, AttendanceList, v.v) */}
        <Outlet />

        {/* Floating Toasts container */}
        <div className="toast-container position-fixed bottom-0 end-0 p-4" style={{ zIndex: 1060 }}>
          {notifications.filter(n => n.showToast).map(n => (
            <div key={n.id} className="toast show bg-white shadow mb-3" role="alert" aria-live="assertive" aria-atomic="true">
              <div className="toast-header bg-primary text-white">
                <Bell size={16} className="me-2" />
                <strong className="me-auto">{n.title}</strong>
                <small>{n.time}</small>
                <button type="button" className="btn-close btn-close-white" onClick={() => {
                  setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, showToast: false } : item));
                }}></button>
              </div>
              <div className="toast-body text-dark fw-medium">
                {n.message}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="main-footer">
        © {new Date().getFullYear()} BKAttendance System. All rights reserved.
      </footer>
    </div>
  );
}
