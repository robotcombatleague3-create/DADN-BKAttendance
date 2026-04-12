const API_URL = 'http://localhost:3000/api';

export const getHistory = async () => {
  const res = await fetch(`${API_URL}/attendance`);
  const data = await res.json();
  return data.data || [];
};

export const getStudents = async () => {
  const res = await fetch(`${API_URL}/students`);
  const data = await res.json();
  return data.data || [];
};

export const assignRfid = async (studentId, rfidUid) => {
  const res = await fetch(`${API_URL}/students/${studentId}/rfid`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ rfidUid })
  });
  return res.json();
};

export const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('vi-VN');
};

export const getStatusClass = (status) => {
  return status === 'Hợp lệ' ? 'valid' : 'invalid';
};
