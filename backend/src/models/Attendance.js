// Mock Data cho Nhật ký Điểm danh
let attendances = [
  { id: 1, studentId: 1, studentCode: '2214567', fullName: 'Nguyễn Văn A', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'Hợp lệ' },
  { id: 2, studentId: 2, studentCode: '2214568', fullName: 'Trần Thị B', timestamp: new Date(Date.now() - 1800000).toISOString(), status: 'Hợp lệ' }
];

let nextId = 3;

class Attendance {
  static getAll() {
    // Sắp xếp giảm dần theo thời gian (mới nhất lên đầu)
    return [...attendances].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  static addLog(student, status) {
    const newLog = {
      id: nextId++,
      studentId: student ? student.id : null,
      studentCode: student ? student.studentCode : 'N/A',
      fullName: student ? student.fullName : 'Không xác định',
      timestamp: new Date().toISOString(),
      status: status
    };
    
    // Giới hạn bộ nhớ 100 log gần nhất cho demo
    if (attendances.length >= 100) {
      attendances.shift(); 
    }
    
    attendances.push(newLog);
    return newLog;
  }
}

module.exports = Attendance;
