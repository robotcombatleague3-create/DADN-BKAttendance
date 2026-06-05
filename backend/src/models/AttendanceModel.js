const db = require('../config/db');

class AttendanceModel {
  // Lấy lịch sử điểm danh đầy đủ
  static async getHistory() {
    const query = `
      SELECT 
        al.session_id,
        al.student_id,
        s.student_code,
        s.name as student_name,
        c.class_name,
        al.checkin_time,
        al.status
      FROM attendance_logs al
      JOIN students s ON al.student_id = s.student_id
      JOIN sessions ss ON al.session_id = ss.session_id
      JOIN classes c ON ss.class_id = c.class_id
      ORDER BY al.checkin_time DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
  }

  // Ghi nhận một lượt quét thẻ vào Database
  static async recordScan(sessionId, studentId, status) {
    await db.execute(`
      INSERT INTO attendance_logs (session_id, student_id, checkin_time, status)
      VALUES (?, ?, NOW(), ?)
      ON DUPLICATE KEY UPDATE checkin_time = NOW(), status = VALUES(status)
    `, [sessionId, studentId, status]);
  }

  // Lấy chi tiết điểm danh của buổi học gần nhất của 1 lớp
  static async getClassAttendance(classId) {
    const query = `
      SELECT 
        s.student_code as mssv,
        s.name,
        LOWER(COALESCE(al.status, 'absent')) as status,
        DATE_FORMAT(al.checkin_time, '%h:%i %p') as time
      FROM class_students cs
      JOIN students s ON cs.student_id = s.student_id
      LEFT JOIN (
        SELECT session_id FROM sessions WHERE class_id = ? ORDER BY session_date DESC, start_time DESC LIMIT 1
      ) latest_session ON 1=1
      LEFT JOIN attendance_logs al ON s.student_id = al.student_id AND al.session_id = latest_session.session_id
      WHERE cs.class_id = ?
    `;
    const [rows] = await db.execute(query, [classId, classId]);
    return rows;
  }

  // Lấy thống kê tổng quan các lớp
  static async getOverallStats() {
    const query = `
      SELECT 
        c.class_name as name,
        COUNT(DISTINCT cs.student_id) as enrolled_students,
        COUNT(DISTINCT ss.session_id) as total_sessions,
        SUM(CASE WHEN al.status = 'Present' THEN 1 ELSE 0 END) as total_present,
        SUM(CASE WHEN al.status = 'Late' THEN 1 ELSE 0 END) as total_late
      FROM classes c
      LEFT JOIN class_students cs ON c.class_id = cs.class_id
      LEFT JOIN sessions ss ON c.class_id = ss.class_id
      LEFT JOIN attendance_logs al ON ss.session_id = al.session_id AND al.student_id = cs.student_id
      GROUP BY c.class_id, c.class_name
    `;
    const [rows] = await db.execute(query);
    
    return rows.map(row => {
      const possibleEvents = row.enrolled_students * (row.total_sessions || 1); 
      // If 0 sessions, avoid returning negative or weird absent stats, just return 0s
      if (row.total_sessions === 0) {
        return { name: row.name, present: 0, late: 0, absent: row.enrolled_students };
      }
      
      const present = Number(row.total_present) || 0;
      const late = Number(row.total_late) || 0;
      const absent = possibleEvents - present - late;
      
      return {
        name: row.name,
        present,
        late,
        absent: absent > 0 ? absent : 0
      };
    });
  }
}

module.exports = AttendanceModel;
