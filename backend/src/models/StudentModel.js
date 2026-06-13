const db = require('../config/db');

class StudentModel {
  static async findByRfid(rfidUid) {
    const [rows] = await db.execute(`
      SELECT s.student_id, s.student_code, s.name as student_name
      FROM rfid_cards rc
      JOIN students s ON rc.student_id = s.student_id
      WHERE rc.rfid_uid = ?
    `, [rfidUid]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async getAllWithDetails() {
    const query = `
      SELECT 
        s.student_id as id,
        s.student_code as code,
        s.name,
        GROUP_CONCAT(DISTINCT c.class_name SEPARATOR ', ') as class,
        rc.rfid_uid
      FROM students s
      LEFT JOIN class_students cs ON s.student_id = cs.student_id
      LEFT JOIN classes c ON cs.class_id = c.class_id
      LEFT JOIN rfid_cards rc ON s.student_id = rc.student_id
      GROUP BY s.student_id, s.student_code, s.name, rc.rfid_uid
      ORDER BY s.student_id
    `;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async createStudent(studentCode, name, rfidUid = null, classId = null) {
    const [rows] = await db.execute(
      'CALL sp_add_student(?, ?, ?, ?)',
      [studentCode, name, rfidUid, classId]
    );
    return rows[0][0];
  }

  static async assignRfid(studentId, rfidUid) {
    await db.execute(
      'CALL sp_update_student(?, NULL, NULL, ?)',
      [studentId, rfidUid]
    );
  }

  static async updateStudent(studentId, name, studentCode, rfidUid = null) {
    await db.execute(
      'CALL sp_update_student(?, ?, ?, ?)',
      [studentId, studentCode, name, rfidUid]
    );
  }

  static async deleteStudent(studentId) {
    await db.execute('CALL sp_delete_student(?)', [studentId]);
  }
}

module.exports = StudentModel;
