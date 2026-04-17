const db = require('../config/db');

exports.getAllStudents = async (req, res) => {
  try {
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
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Database error in getAllStudents:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách sinh viên' });
  }
};

exports.assignRfid = async (req, res) => {
  const { id } = req.params; // student_id
  const { rfidUid } = req.body;

  if (!rfidUid) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mã RFID' });
  }

  try {
    // Thêm hoặc cập nhật thẻ RFID cho sinh viên
    await db.execute(`
      INSERT INTO rfid_cards (rfid_uid, student_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE student_id = VALUES(student_id)
    `, [rfidUid, id]);

    res.json({ success: true, message: 'Gán thẻ RFID thành công' });
  } catch (error) {
    console.error('Database error in assignRfid:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi gán thẻ RFID' });
  }
};
