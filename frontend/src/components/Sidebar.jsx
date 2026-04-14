import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="logo">BK Attendance</div>
      <ul className="nav-links">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            📍 Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/students" className={({ isActive }) => (isActive ? 'active' : '')}>
            👥 Quản lý Sinh viên
          </NavLink>
        </li>
        <li>
          <NavLink to="/history" className={({ isActive }) => (isActive ? 'active' : '')}>
            🕒 Lịch sử
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
