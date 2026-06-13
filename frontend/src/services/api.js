const API_URL = 'http://localhost:3000/api';

const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers });
};

export const login = async (email, password) => {
  const res = await apiFetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const getHistory = async () => {
  const res = await apiFetch(`${API_URL}/attendance/history`);
  const data = await res.json();
  return data.data || [];
};

export const getClassAttendance = async (classId) => {
  const res = await apiFetch(`${API_URL}/attendance/class/${classId}`);
  const data = await res.json();
  return data.data || [];
};

export const getOverallStats = async () => {
  const res = await apiFetch(`${API_URL}/stats`);
  const data = await res.json();
  return data.data || [];
};

export const getStudents = async () => {
  const res = await apiFetch(`${API_URL}/students`);
  const data = await res.json();
  return data.data || [];
};

export const getLecturers = async () => {
  const res = await apiFetch(`${API_URL}/lecturers`);
  const data = await res.json();
  return data.data || [];
};

export const getClasses = async () => {
  const res = await apiFetch(`${API_URL}/classes`);
  const data = await res.json();
  return data.data || [];
};

export const getLecturerClasses = async (userId) => {
  const res = await apiFetch(`${API_URL}/classes/lecturer?lecturerId=${userId}`);
  return res.json();
};


export const assignRfid = async (studentId, rfidUid) => {
  const res = await apiFetch(`${API_URL}/students/${studentId}/rfid`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ rfidUid })
  });
  return res.json();
};

export const createStudent = async (studentData) => {
  const res = await apiFetch(`${API_URL}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData)
  });
  return res.json();
};

export const updateStudent = async (studentId, studentData) => {
  const res = await apiFetch(`${API_URL}/students/${studentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(studentData)
  });
  return res.json();
};

export const deleteStudent = async (studentId) => {
  const res = await apiFetch(`${API_URL}/students/${studentId}`, {
    method: 'DELETE'
  });
  return res.json();
};

export const createLecturer = async (lecturerData) => {
  const res = await apiFetch(`${API_URL}/lecturers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lecturerData)
  });
  return res.json();
};

export const updateLecturer = async (userId, lecturerData) => {
  const res = await apiFetch(`${API_URL}/lecturers/user/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lecturerData)
  });
  return res.json();
};

export const deleteLecturer = async (lecturerId) => {
  const res = await apiFetch(`${API_URL}/lecturers/${lecturerId}`, {
    method: 'DELETE'
  });
  return res.json();
};

export const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('vi-VN');
};

export const getStatusClass = (status) => {
  switch (status) {
    case 'Present': return 'valid';
    case 'Late': return 'warning';
    case 'Absent': return 'invalid';
    default: return '';
  }
};

export const getStudentAttendanceHistory = async (studentId, classId = '') => {
  const url = classId 
    ? `${API_URL}/attendance/student/${studentId}?classId=${classId}` 
    : `${API_URL}/attendance/student/${studentId}`;
  const res = await apiFetch(url);
  const data = await res.json();
  return data.data || [];
};

export const getLecturerProfile = async (userId) => {
  const res = await apiFetch(`${API_URL}/lecturers/profile/${userId}`);
  const data = await res.json();
  return data.data || null;
};

export const updateLecturerProfile = async (userId, profileData) => {
  const res = await apiFetch(`${API_URL}/lecturers/profile/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  });
  return res.json();
};

export const getLecturerHistory = async (userId) => {
  const res = await apiFetch(`${API_URL}/lecturers/history/${userId}`);
  const data = await res.json();
  return data.data || [];
};
