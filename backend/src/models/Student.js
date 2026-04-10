// Mock Data cho Sinh Viên
let students = [
  { id: 1, studentCode: '2214567', fullName: 'Nguyễn Văn A', rfidUid: 'A1B2C3D4' },
  { id: 2, studentCode: '2214568', fullName: 'Trần Thị B', rfidUid: 'E5F6G7H8' },
  { id: 3, studentCode: '2214569', fullName: 'Lê Văn C', rfidUid: 'I9J0K1L2' },
  { id: 4, studentCode: '2214570', fullName: 'Phạm Thị D', rfidUid: null }, // Sinh viên chưa gán thẻ
];

class Student {
  static getAll() {
    return students;
  }

  static getByRfid(rfidUid) {
    return students.find(s => s.rfidUid === rfidUid);
  }

  static assignRfid(studentId, rfidUid) {
    const student = students.find(s => s.id === parseInt(studentId));
    if (student) {
      student.rfidUid = rfidUid;
      return student;
    }
    return null;
  }
}

module.exports = Student;
