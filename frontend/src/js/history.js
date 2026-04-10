import { getHistory, formatDateTime, getStatusClass } from './api.js';

const tbody = document.getElementById('history-body');

async function loadHistory() {
  const history = await getHistory();
  tbody.innerHTML = '';
  
  history.forEach(log => {
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
      <td>${log.id}</td>
      <td><strong>${log.studentCode}</strong></td>
      <td>${log.fullName}</td>
      <td>${formatDateTime(log.timestamp)}</td>
      <td><span class="status ${getStatusClass(log.status)}">${log.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadHistory();
});
