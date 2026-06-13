const db = require('../config/db');

class LecturerModel {
  static async getAll() {
    const query = `
      SELECT 
        l.lecturer_id as id,
        u.user_id,
        u.name,
        u.email,
        l.department as khoa,
        l.specialization as major,
        rc.rfid_uid
      FROM lecturers l
      JOIN users u ON l.user_id = u.user_id
      LEFT JOIN rfid_cards rc ON u.user_id = rc.user_id
    `;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async createLecturer(name, email, password, department, specialization, rfidUid = null) {
    const [rows] = await db.execute(
      'CALL sp_add_lecturer(?, ?, ?, ?, ?, ?)',
      [name, email, password, department, specialization, rfidUid]
    );
    return rows[0][0];
  }

  static async updateLecturer(userId, name, email, department, specialization, rfidUid = null) {
    await db.execute(
      'CALL sp_update_lecturer(?, ?, ?, ?, ?, ?)',
      [userId, name, email, department, specialization, rfidUid]
    );
  }

  static async deleteLecturer(lecturerId) {
    await db.execute('CALL sp_delete_lecturer(?)', [lecturerId]);
  }
}

module.exports = LecturerModel;
