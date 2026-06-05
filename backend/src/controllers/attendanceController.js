const StudentModel = require('../models/StudentModel');
const SessionModel = require('../models/SessionModel');
const AttendanceModel = require('../models/AttendanceModel');

// Lấy danh sách lịch sử điểm danh
exports.getHistory = async (req, res) => {
  try {
    const history = await AttendanceModel.getHistory();
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Database error in getHistory:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy dữ liệu' });
  }
};

exports.getClassAttendance = async (req, res) => {
  const { classId } = req.params;
  try {
    const data = await AttendanceModel.getClassAttendance(classId);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Database error in getClassAttendance:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy chi tiết điểm danh' });
  }
};

exports.getOverallStats = async (req, res) => {
  try {
    const stats = await AttendanceModel.getOverallStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Database error in getOverallStats:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy thống kê' });
  }
};

// API nhận dữ liệu từ ESP32 hoặc Trang Test khi quét thẻ
exports.scanCard = async (req, res) => {
  const { rfid_uid } = req.body;

  if (!rfid_uid) {
    return res.status(400).json({ success: false, message: 'Thiếu RFID UID' });
  }

  try {
    // 1. Gọi Model để kiểm tra thông tin sinh viên
    const student = await StudentModel.findByRfid(rfid_uid);

    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: "Thẻ không hợp lệ hoặc chưa được đăng ký!" 
      });
    }

    // 2. Gọi Model để tìm session đang hoạt động
    const session = await SessionModel.getActiveSession();

    if (!session) {
      return res.status(400).json({ 
        success: false, 
        message: 'Không có buổi học nào đang diễn ra tại thời điểm này!' 
      });
    }

    const { session_id, late_threshold } = session;
    const currentTime = new Date();
    const timeString = currentTime.toTimeString().split(' ')[0]; // HH:MM:SS
    const status = timeString <= late_threshold ? 'Present' : 'Late';

    // 3. Gọi Model để thực hiện lưu điểm danh
    await AttendanceModel.recordScan(session_id, student.student_id, status);

    const responseData = {
      success: true,
      data: {
        name: student.student_name,
        student_code: student.student_code,
        time: currentTime.toLocaleString('vi-VN')
      }
    };

    // Phát event cho Frontend
    const io = req.io;
    if (io) {
      io.emit('new_attendance', {
        ...responseData.data,
        class_name: 'Đang cập nhật...', 
        status: status
      });
    }

    res.status(200).json(responseData);

  } catch (error) {
    console.error('Database error in scanCard:', error);
    res.status(500).json({ success: false, message: 'Lỗi hệ thống khi xử lý thẻ' });
  }
};
