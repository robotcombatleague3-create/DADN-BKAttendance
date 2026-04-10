import { getStudents, assignRfid, showFlashMessage } from './api.js';

const tbody = document.getElementById('students-body');
const form = document.getElementById('assign-form');
const inputStudentId = document.getElementById('student-id');
const inputRfidUid = document.getElementById('rfid-uid');
const labelStudentName = document.getElementById('selected-student-name');

async function loadStudents() {
  const students = await getStudents();
  tbody.innerHTML = '';
  
  students.forEach(student => {
    const tr = document.createElement('tr');
    const hasRfid = student.rfidUid ? 'Thẻ: ' + student.rfidUid : '<span style="color:#EF4444">Chưa gán thẻ</span>';
    
    tr.innerHTML = `
      <td>${student.id}</td>
      <td><strong>${student.studentCode}</strong></td>
      <td>${student.fullName}</td>
      <td>${hasRfid}</td>
      <td>
        <button class="btn-assign" data-id="${student.id}" data-name="${student.fullName}"> Chọn Gán thẻ</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Gắn event listener cho nút Chọn
  document.querySelectorAll('.btn-assign').forEach(btn => {
    btn.style.padding = '0.4rem 0.8rem';
    btn.style.borderRadius = '6px';
    btn.style.border = '1px solid #4F46E5';
    btn.style.background = 'transparent';
    btn.style.color = '#fff';
    btn.style.cursor = 'pointer';
    
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      const name = e.target.getAttribute('data-name');
      
      inputStudentId.value = id;
      labelStudentName.innerText = name;
      inputRfidUid.focus();
    });
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const studentId = inputStudentId.value;
  const rfidUid = inputRfidUid.value;
  
  if (!studentId) {
    showFlashMessage('Vui lòng chọn sinh viên cần gán mã', 'error');
    return;
  }

  try {
    const res = await assignRfid(studentId, rfidUid);
    if (res.success) {
      showFlashMessage(res.message, 'success');
      inputRfidUid.value = '';
      inputStudentId.value = '';
      labelStudentName.innerText = 'Chưa chọn';
      loadStudents(); // Reload lại bảng
    } else {
      showFlashMessage(res.message || 'Lỗi gán mã', 'error');
    }
  } catch (error) {
    console.error(error);
    showFlashMessage('Lỗi kết nối Server', 'error');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadStudents();
});
