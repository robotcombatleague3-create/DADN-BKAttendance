const db = require('../config/db');

class LecturerModel {
  static async getAll() {
    const query = `
      SELECT 
        l.lecturer_id as id,
        u.full_name as name,
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
}

module.exports = LecturerModel;
