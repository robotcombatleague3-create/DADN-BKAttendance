const db = require('../config/db');

class SessionModel {
  // Lấy thông tin buổi học đang diễn ra trong thời điểm hiện tại
  static async getActiveSession() {
    const [rows] = await db.execute(`
      SELECT session_id, start_time, late_threshold 
      FROM sessions 
      WHERE session_date = CURDATE() 
      AND CURTIME() BETWEEN start_time AND end_time
      LIMIT 1
    `);
    return rows.length > 0 ? rows[0] : null;
  }
}

module.exports = SessionModel;
