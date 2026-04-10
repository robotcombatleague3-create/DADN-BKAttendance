import { socket } from './socket.js';
import { getHistory, formatDateTime, getStatusClass, showFlashMessage } from './api.js';

const tbody = document.getElementById('attendance-body');

// Load dữ liệu ban đầu
async function loadInitialData() {
  const history = await getHistory();
  tbody.innerHTML = '';
  // Chỉ lấy 20 log mới nhất cho dashboard
  history.slice(0, 20).forEach(log => {
    tbody.appendChild(createRow(log));
  });
}

function createRow(log, isNew = false) {
  const tr = document.createElement('tr');
  if (isNew) {
    tr.classList.add('new-row');
  }
  
  tr.innerHTML = `
    <td>${log.id}</td>
    <td><strong>${log.studentCode}</strong></td>
    <td>${log.fullName}</td>
    <td>${formatDateTime(log.timestamp)}</td>
    <td><span class="status ${getStatusClass(log.status)}">${log.status}</span></td>
  `;
  return tr;
}

// Lắng nghe sự kiện Real-time
socket.on('new_attendance', (newLog) => {
  // Thêm vào đầu bảng
  const newRow = createRow(newLog, true);
  tbody.insertBefore(newRow, tbody.firstChild);

  // Hiển thị Flash Message
  const msgText = newLog.status === 'Hợp lệ' 
    ? `✅ Điểm danh thành công: ${newLog.fullName}`
    : `⚠️ Cảnh báo: ${newLog.status}`;
  const msgType = newLog.status === 'Hợp lệ' ? 'success' : 'error';
  
  showFlashMessage(msgText, msgType);
});

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadInitialData();
});
