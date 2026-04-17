const db = require('../config/db');

// Lấy danh sách lịch sử điểm danh (JOIN nhiều bảng)
exports.getHistory = async (req, res) => {
  try {
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
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Database error in getHistory:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy dữ liệu' });
  }
};

// API nhận dữ liệu từ ESP32 hoặc Trang Test khi quét thẻ
exports.scanCard = async (req, res) => {
  const { rfid_uid } = req.body;

  if (!rfid_uid) {
    return res.status(400).json({ success: false, message: 'Thiếu RFID UID' });
  }

  try {
    // 1. Dùng câu lệnh SQL (SELECT) query vào bảng rfid_cards JOIN với bảng students
    const [studentRows] = await db.execute(`
      SELECT s.student_id, s.student_code, s.name as student_name
      FROM rfid_cards rc
      JOIN students s ON rc.student_id = s.student_id
      WHERE rc.rfid_uid = ?
    `, [rfid_uid]);

    // 2. Nếu KHÔNG tìm thấy thẻ: Trả về HTTP 404
    if (studentRows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Thẻ không hợp lệ hoặc chưa được đăng ký!" 
      });
    }

    const student = studentRows[0];

    // 3. Tìm session đang hoạt động (Bắt buộc để INSERT vào attendance_logs)
    const [sessionRows] = await db.execute(`
      SELECT session_id, late_threshold 
      FROM sessions 
      WHERE session_date = CURDATE() 
      AND CURTIME() BETWEEN start_time AND end_time
      LIMIT 1
    `);

    if (sessionRows.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Không có buổi học nào đang diễn ra tại thời điểm này!' 
      });
    }

    const { session_id, late_threshold } = sessionRows[0];
    const currentTime = new Date();
    const timeString = currentTime.toTimeString().split(' ')[0]; // HH:MM:SS
    const status = timeString <= late_threshold ? 'Present' : 'Late';

    // 4. Thực hiện INSERT vào bảng attendance_logs (Sử dụng ON DUPLICATE KEY UPDATE để tránh lỗi nếu quét 2 lần)
    await db.execute(`
      INSERT INTO attendance_logs (session_id, student_id, checkin_time, status)
      VALUES (?, ?, NOW(), ?)
      ON DUPLICATE KEY UPDATE checkin_time = NOW(), status = VALUES(status)
    `, [session_id, student.student_id, status]);

    // 5. Trả về HTTP 200 với JSON chứa thông tin sinh viên
    const responseData = {
      success: true,
      data: {
        name: student.student_name,
        student_code: student.student_code,
        time: currentTime.toLocaleString('vi-VN')
      }
    };

    // Phát event cho Frontend (Real-time dashboard)
    const io = req.io;
    if (io) {
      io.emit('new_attendance', {
        ...responseData.data,
        class_name: 'Đang cập nhật...', // Có thể lấy thêm class_name nếu cần
        status: status
      });
    }

    res.status(200).json(responseData);

  } catch (error) {
    console.error('Database error in scanCard:', error);
    res.status(500).json({ success: false, message: 'Lỗi hệ thống khi xử lý thẻ' });
  }
};
