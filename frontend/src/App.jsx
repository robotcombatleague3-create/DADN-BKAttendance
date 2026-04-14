import React, { useState, createContext, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Other Pages (Lecturer)
import Students from './pages/Students';
import History from './pages/History';
import LecturerProfile from './pages/LecturerProfile';
import Home from './pages/Attendance/Home';
import AttendanceList from './pages/Attendance/AttendanceList';
import AttendanceDetail from './pages/Attendance/AttendanceDetail';
import AttendanceStats from './pages/Attendance/AttendanceStats';

// Auth Pages
import Landing from './pages/Auth/Landing';
import RoleSelection from './pages/Auth/RoleSelection';
import LoginForm from './pages/Auth/LoginForm';

// Attendance Pages (Admin)
import AdminHome from './pages/Attendance/AdminHome';
import AdminAttendanceList from './pages/Attendance/AdminAttendanceList';
import AdminAttendanceDetail from './pages/Attendance/AdminAttendanceDetail';
import AdminAttendanceStats from './pages/Attendance/AdminAttendanceStats';
import AdminStudents from './pages/Attendance/AdminStudents';
import AdminLecturers from './pages/Attendance/AdminLecturers';
import AdminProfile from './pages/AdminProfile';

export const FlashContext = createContext(null);

function App() {
  const [messages, setMessages] = useState([]);

  const addFlashMessage = useCallback((text, type = 'success') => {
    const id = Date.now() + Math.random();
    setMessages((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 3500);
  }, []);

  return (
    <FlashContext.Provider value={addFlashMessage}>
      <Router>
        {/* Global Flash Messages that float over everything */}
        <div className="flash-container" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flash-message ${msg.type}`}
              style={msg.type === 'error' ? { borderColor: '#EF4444' } : {}}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/roles" element={<RoleSelection />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<Navigate to="/login" replace />} />

          {/* Admin App Routes */}
          <Route path="/admin" element={<MainLayout role="admin" />}>
            <Route index element={<Navigate to="/admin/home" replace />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="attendance" element={<AdminAttendanceList />} />
            <Route path="attendance/:classId" element={<AdminAttendanceDetail />} />
            <Route path="attendance/:classId/stats" element={<AdminAttendanceStats />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="lecturers" element={<AdminLecturers />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* Lecturer App Routes */}
          <Route path="/lecturer" element={<MainLayout role="lecturer" />}>
            <Route index element={<Navigate to="/lecturer/home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="attendance" element={<AttendanceList />} />
            <Route path="attendance/:classId" element={<AttendanceDetail />} />
            <Route path="attendance/:classId/stats" element={<AttendanceStats />} />
            <Route path="students" element={<Students />} />
            <Route path="profile" element={<LecturerProfile />} />
          </Route>
        </Routes>
      </Router>
    </FlashContext.Provider>
  );
}

export default App;
