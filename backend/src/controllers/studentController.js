const StudentModel = require('../models/StudentModel');

exports.createStudent = async (req, res) => {
  const { code, name, rfidUid, classId } = req.body;

  if (!code || !name) {
    return res.status(400).json({ success: false, message: 'Mã sinh viên và tên là bắt buộc' });
  }

  try {
    const result = await StudentModel.createStudent(code, name, rfidUid || null, classId || null);
    res.status(201).json({
      success: true,
      message: 'Thêm sinh viên thành công',
      data: { student_id: result.student_id }
    });
  } catch (error) {
    console.error('Database error in createStudent:', error);
    const message = error.sqlMessage || 'Lỗi máy chủ khi thêm sinh viên';
    res.status(400).json({ success: false, message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await StudentModel.getAllWithDetails();
    res.json({ success: true, data: students });
  } catch (error) {
    console.error('Database error in getAllStudents:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách sinh viên' });
  }
};

exports.syncHardware = async (req, res) => {
  try {
    const db = require('../config/db');
    const { mqttClient } = require('../../server');
    
    // Lấy danh sách thẻ RFID kèm thông tin sinh viên và 1 lớp học bất kỳ (cùng giờ bắt đầu)
    const [rows] = await db.execute(`
      SELECT 
        r.rfid_uid, 
        s.student_id, 
        s.name,
        MAX(c.class_name) as class_name,
        MAX(sess.start_time) as start_time
      FROM rfid_cards r 
      JOIN students s ON r.student_id = s.student_id
      LEFT JOIN class_students cs ON s.student_id = cs.student_id
      LEFT JOIN classes c ON cs.class_id = c.class_id
      LEFT JOIN sessions sess ON c.class_id = sess.class_id
      WHERE r.rfid_uid IS NOT NULL
      GROUP BY s.student_id, r.rfid_uid, s.name
    `);

    // Tạo mảng gọn nhẹ để gửi
    const payloadArray = rows.map(row => ({
      u: row.rfid_uid,
      i: row.student_id,
      n: row.name,
      c: row.class_name || "Chưa có lớp",
      t: row.start_time || "00:00:00"
    }));

    const jsonStr = 'SYNC_DB:' + JSON.stringify(payloadArray);
    
    if (mqttClient && mqttClient.connected) {
      mqttClient.publish('test/vinh/mqtt/recv', jsonStr);
      res.json({ success: true, message: `Đã đồng bộ ${payloadArray.length} thẻ xuống phần cứng.` });
    } else {
      res.status(500).json({ success: false, message: 'Chưa kết nối đến MQTT Broker.' });
    }
  } catch (error) {
    console.error('Lỗi khi đồng bộ phần cứng:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi đồng bộ.' });
  }
};

exports.assignRfid = async (req, res) => {
  const { id } = req.params; // student_id
  const { rfidUid } = req.body;

  if (!rfidUid) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mã RFID' });
  }

  try {
    await StudentModel.assignRfid(id, rfidUid);
    res.json({ success: true, message: 'Gán thẻ RFID thành công' });
  } catch (error) {
    console.error('Database error in assignRfid:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi gán thẻ RFID' });
  }
};

exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, code, rfidUid } = req.body;

  try {
    await StudentModel.updateStudent(
      id,
      name || null,
      code || null,
      rfidUid !== undefined ? rfidUid : null
    );
    res.json({ success: true, message: 'Cập nhật sinh viên thành công' });
  } catch (error) {
    console.error('Database error in updateStudent:', error);
    const message = error.sqlMessage || 'Lỗi máy chủ khi cập nhật thông tin';
    res.status(400).json({ success: false, message });
  }
};

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await StudentModel.deleteStudent(id);
    res.json({ success: true, message: 'Xóa sinh viên thành công' });
  } catch (error) {
    console.error('Database error in deleteStudent:', error);
    const message = error.sqlMessage || 'Lỗi máy chủ khi xóa sinh viên';
    res.status(400).json({ success: false, message });
  }
};
