const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Lấy danh sách lịch sử điểm danh
exports.getHistory = (req, res) => {
  const history = Attendance.getAll();
  res.json({ success: true, data: history });
};

// ESP32 gọi endpoint này khi quét thẻ
exports.scanCard = (req, res) => {
  const { rfidUid } = req.body;

  if (!rfidUid) {
    return res.status(400).json({ success: false, message: 'Missing RFID UID' });
  }

  // Tìm sinh viên theo mã thẻ
  const student = Student.getByRfid(rfidUid);
  
  // Trạng thái điểm danh
  const status = student ? 'Hợp lệ' : 'Thẻ lạ/Không hợp lệ';

  // Ghi log
  const newLog = Attendance.addLog(student, status);

  // Phát event qua WebSocket cho Frontend cập nhật UI (Real-time Observer)
  const io = req.io;
  if (io) {
    io.emit('new_attendance', newLog);
  }

  res.json({ success: true, message: 'Quét thẻ thành công', log: newLog });
};
