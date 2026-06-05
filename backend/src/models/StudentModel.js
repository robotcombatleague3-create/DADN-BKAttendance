const db = require('../config/db');

class StudentModel {
  // Tìm kiếm sinh viên dựa vào mã thẻ RFID
  static async findByRfid(rfidUid) {
    const [rows] = await db.execute(`
      SELECT s.student_id, s.student_code, s.name as student_name
      FROM rfid_cards rc
      JOIN students s ON rc.student_id = s.student_id
      WHERE rc.rfid_uid = ?
    `, [rfidUid]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Lấy toàn bộ danh sách sinh viên kèm theo lớp và thẻ RFID
  static async getAllWithDetails() {
    const query = `
      SELECT 
        s.student_id as id,
        s.student_code as code,
        s.name,
        c.class_name as class,
        rc.rfid_uid
      FROM students s
      LEFT JOIN class_students cs ON s.student_id = cs.student_id
      LEFT JOIN classes c ON cs.class_id = c.class_id
      LEFT JOIN rfid_cards rc ON s.student_id = rc.student_id
    `;
    const [rows] = await db.execute(query);
    return rows;
  }

  // Gán hoặc cập nhật thẻ RFID cho sinh viên
  static async assignRfid(studentId, rfidUid) {
    await db.execute(`
      INSERT INTO rfid_cards (rfid_uid, student_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE student_id = VALUES(student_id)
    `, [rfidUid, studentId]);
  }

  // Cập nhật thông tin cơ bản sinh viên
  static async updateStudent(studentId, name, studentCode) {
    await db.execute(`
      UPDATE students 
      SET name = ?, student_code = ?
      WHERE student_id = ?
    `, [name, studentCode, studentId]);
  }

  // Xóa sinh viên (Do đã setup ON DELETE CASCADE hoặc SET NULL ở DB nên rfid_cards và attendance_logs sẽ tự xử lý)
  static async deleteStudent(studentId) {
    await db.execute(`
      DELETE FROM students
      WHERE student_id = ?
    `, [studentId]);
  }
}

module.exports = StudentModel;
