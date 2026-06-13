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
        MAX(rc.rfid_uid) as rfid_uid
      FROM lecturers l
      JOIN users u ON l.user_id = u.user_id
      LEFT JOIN rfid_cards rc ON u.user_id = rc.user_id
      GROUP BY l.lecturer_id, u.user_id, u.name, u.email, l.department, l.specialization
    `;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async createLecturer(name, khoa, email, password = '123456') {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Insert into users
      const [userResult] = await conn.execute(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'lecturer')`,
        [name, email || `gv_${Date.now()}@hcmut.edu.vn`, password]
      );
      const userId = userResult.insertId;

      // 2. Insert into lecturers
      const [lecturerResult] = await conn.execute(
        `INSERT INTO lecturers (user_id, department) VALUES (?, ?)`,
        [userId, khoa || null]
      );
      
      await conn.commit();
      return { id: lecturerResult.insertId, user_id: userId };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async updateLecturer(lecturerId, userId, name, khoa) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Update name in users
      await conn.execute(`UPDATE users SET name = ? WHERE user_id = ?`, [name, userId]);
      
      // Update department in lecturers
      await conn.execute(`UPDATE lecturers SET department = ? WHERE lecturer_id = ?`, [khoa || null, lecturerId]);

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async deleteLecturer(userId) {
    // Due to ON DELETE CASCADE on lecturers.user_id referencing users.user_id,
    // deleting the user will automatically delete the lecturer record.
    await db.execute(`DELETE FROM users WHERE user_id = ?`, [userId]);
  }

  static async assignRfid(userId, rfidUid) {
    await db.execute(`
      INSERT INTO rfid_cards (rfid_uid, user_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)
    `, [rfidUid, userId]);
  }
}

module.exports = LecturerModel;
