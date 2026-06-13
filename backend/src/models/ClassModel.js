const db = require('../config/db');

class ClassModel {
  static async getAllClasses() {
    const query = `
      SELECT 
        c.class_id as id,
        c.class_name as name,
        u.name as lecturer,
        (SELECT COUNT(*) FROM class_students cs WHERE cs.class_id = c.class_id) as students,
        (SELECT COUNT(*) FROM sessions s WHERE s.class_id = c.class_id AND s.session_date = CURDATE() AND CURTIME() BETWEEN s.start_time AND s.end_time) as is_online
      FROM classes c
      JOIN lecturers l ON c.lecturer_id = l.lecturer_id
      JOIN users u ON l.user_id = u.user_id
    `;
    const [rows] = await db.execute(query);
    // Tính toán thêm dummy time và status để khớp UI nếu DB chưa hỗ trợ
    return rows.map(r => ({
      ...r,
      time: 'T2 07:00 - 09h50', // Mock schedule string for now
      status: r.is_online > 0 ? 'online' : 'offline'
    }));
  }
}

module.exports = ClassModel;
