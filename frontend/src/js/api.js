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

export const showFlashMessage = (message, type = 'success') => {
  const container = document.getElementById('flash-container');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `flash-message ${type}`;
  msgDiv.innerText = message;
  
  if (type === 'error') {
    msgDiv.style.borderColor = '#EF4444';
  }

  container.appendChild(msgDiv);

  // Auto remove sau khi animation fadeOut hoàn tất (3.5s tổng)
  setTimeout(() => {
    if (container.contains(msgDiv)) {
      container.removeChild(msgDiv);
    }
  }, 3500);
};
