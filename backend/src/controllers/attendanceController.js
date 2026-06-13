const StudentModel = require('../models/StudentModel');
const SessionModel = require('../models/SessionModel');
const AttendanceModel = require('../models/AttendanceModel');
const db = require('../config/db'); // Ensure db is imported if used
// ==================== STRATEGY PATTERN FOR ATTENDANCE STATUS ====================
// Interface/Base Strategy
class StatusStrategy {
  evaluate(checkinTimeStr, startTimeStr, lateThresholdStr) {
    throw new Error('Method evaluate() must be implemented.');
  }
}

class PresentStrategy extends StatusStrategy {
  evaluate(checkinTimeStr, startTimeStr, lateThresholdStr) {
    if (checkinTimeStr <= startTimeStr) return 'Present';
    return null;
  }
}

class LateStrategy extends StatusStrategy {
  evaluate(checkinTimeStr, startTimeStr, lateThresholdStr) {
    if (checkinTimeStr > startTimeStr && checkinTimeStr <= lateThresholdStr) return 'Late';
    return null;
  }
}

class AbsentStrategy extends StatusStrategy {
  evaluate(checkinTimeStr, startTimeStr, lateThresholdStr) {
    // Nếu trễ hơn thời gian cho phép đi trễ thì đánh Vắng
    if (checkinTimeStr > lateThresholdStr) return 'Absent';
    return null;
  }
}

class AttendanceContext {
  constructor() {
    this.strategies = [
      new PresentStrategy(),
      new LateStrategy(),
      new AbsentStrategy()
    ];
  }

  determineStatus(checkinTimeStr, startTimeStr, lateThresholdStr) {
    for (const strategy of this.strategies) {
      const status = strategy.evaluate(checkinTimeStr, startTimeStr, lateThresholdStr);
      if (status) return status;
    }
    return 'Absent'; // Default fallback
  }
}

const attendanceContext = new AttendanceContext();
// ===============================================================================

// 1. Lấy danh sách lớp của giảng viên
exports.getClasses = async (req, res) => {
  try {
    const { lecturerId } = req.query;
    if (!lecturerId) {
      return res.status(400).json({ success: false, message: 'Thiếu lecturerId' });
    }

    const query = `
      SELECT 
        c.class_id,
        c.class_name
      FROM classes c
      JOIN lecturers l ON c.lecturer_id = l.lecturer_id
      WHERE l.user_id = ?
    `;
    
    const [rows] = await db.execute(query, [lecturerId]);
    
    // Parse class_name "Nguyên lý ngôn ngữ lập trình L01 | H6-301" -> Name: "Nguyên lý ngôn ngữ lập trình L01", Room: "H6-301"
    const parsedData = rows.map(row => {
      let className = row.class_name;
      let room = 'Chưa xác định';
      if (row.class_name.includes('|')) {
        const parts = row.class_name.split('|');
        className = parts[0].trim();
        room = parts[1].trim();
      }
      return {
        class_id: row.class_id,
        class_code: row.class_id.toString(), // Mã lớp (có thể dùng string ID)
        class_name: className,
        room: room
      };
    });

    res.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Database error in getClasses:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách lớp' });
  }
};

// 2. Tra cứu lịch sử điểm danh (hỗ trợ filter classId, date)
exports.getHistory = async (req, res) => {
  try {
    const { classId, date } = req.query;
    let query = `
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
      WHERE 1=1
    `;
    
    const queryParams = [];

    if (classId) {
      query += ' AND c.class_id = ?';
      queryParams.push(classId);
    }
    
    if (date) {
      query += ' AND ss.session_date = ?';
      queryParams.push(date);
    }

    query += ' ORDER BY al.checkin_time DESC';

    const [rows] = await db.execute(query, queryParams);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Database error in getHistory:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy dữ liệu' });
  }
};

// 3. Lấy thống kê cơ bản cho biểu đồ
exports.getClassStats = async (req, res) => {
  try {
    const { classId } = req.params;
    if (!classId) {
      return res.status(400).json({ success: false, message: 'Thiếu classId' });
    }

    // Đếm tổng số sinh viên trong lớp
    const [totalStudentsRows] = await db.execute(`
      SELECT COUNT(student_id) as total_students 
      FROM class_students 
      WHERE class_id = ?
    `, [classId]);
    const totalStudents = totalStudentsRows[0].total_students || 0;

    // Tìm buổi học gần nhất của lớp này
    const [sessionRows] = await db.execute(`
      SELECT session_id 
      FROM sessions 
      WHERE class_id = ? 
      ORDER BY session_date DESC, start_time DESC 
      LIMIT 1
    `, [classId]);

    let present = 0, late = 0, absent = totalStudents;

    if (sessionRows.length > 0) {
      const sessionId = sessionRows[0].session_id;

      // Đếm trạng thái từ bảng attendance_logs
      const [statsRows] = await db.execute(`
        SELECT status, COUNT(*) as count 
        FROM attendance_logs 
        WHERE session_id = ? 
        GROUP BY status
      `, [sessionId]);

      statsRows.forEach(row => {
        if (row.status === 'Present') present = row.count;
        if (row.status === 'Late') late = row.count;
      });
      // Số người vắng là tổng số SV trừ đi những người đã có log (Present hoặc Late) 
      absent = totalStudents - present - late;
      if (absent < 0) absent = 0;
    }

    res.json({
      success: true,
      data: {
        total_students: totalStudents,
        present: present,
        late: late,
        absent: absent
      }
    });

  } catch (error) {
    console.error('Database error in getClassStats:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy thống kê' });
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

exports.processScanLogic = async (rfid_uid, io) => {
  try {
    const student = await StudentModel.findByRfid(rfid_uid);
    if (!student) {
      return { success: false, statusCode: 404, message: "Thẻ không hợp lệ hoặc chưa được đăng ký!" };
    }

    const session = await SessionModel.getActiveSession();
    if (!session) {
      return { success: false, statusCode: 400, message: 'Không có buổi học nào đang diễn ra tại thời điểm này!' };
    }

    const { session_id, start_time, late_threshold } = session;
    const currentTime = new Date();
    const timeString = currentTime.toTimeString().split(' ')[0]; // HH:MM:SS
    
    // Sử dụng Strategy Pattern để xác định status
    const status = attendanceContext.determineStatus(timeString, start_time, late_threshold);

    // Gọi Model để thực hiện lưu điểm danh
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
    if (io) {
      io.emit('new_attendance', {
        ...responseData.data,
        class_name: 'Đang cập nhật...', 
        status: status
      });
    }

    return responseData;
  } catch (error) {
    console.error('Database error in processScanLogic:', error);
    return { success: false, statusCode: 500, message: 'Lỗi hệ thống khi xử lý thẻ' };
  }
};

// 4. API nhận dữ liệu từ ESP32 hoặc Trang Test khi quét thẻ
exports.scanCard = async (req, res) => {
  const { rfid_uid } = req.body;

  if (!rfid_uid) {
    return res.status(400).json({ success: false, message: 'Thiếu RFID UID' });
  }

  const result = await exports.processScanLogic(rfid_uid, req.io);
  if (!result.success) {
    return res.status(result.statusCode).json({ success: false, message: result.message });
  }

  res.status(200).json(result);
};

// 5. Lấy lịch sử điểm danh của 1 Sinh viên cụ thể
exports.getStudentAttendanceHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { classId } = req.query;

    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Thiếu studentId' });
    }

    let query = `
      SELECT 
        al.session_id,
        c.class_name,
        c.class_id,
        ss.session_date,
        ss.start_time,
        ss.end_time,
        al.checkin_time,
        al.status
      FROM attendance_logs al
      JOIN sessions ss ON al.session_id = ss.session_id
      JOIN classes c ON ss.class_id = c.class_id
      WHERE al.student_id = ?
    `;

    const queryParams = [studentId];

    if (classId) {
      query += ' AND c.class_id = ?';
      queryParams.push(classId);
    }

    query += ' ORDER BY ss.session_date DESC, ss.start_time DESC';

    const [rows] = await db.execute(query, queryParams);
    
    // Parse class_name "Nguyên lý ngôn ngữ lập trình L01 | H6-301" -> Name: "Nguyên lý ngôn ngữ lập trình L01", Room: "H6-301"
    const parsedData = rows.map(row => {
      let className = row.class_name;
      let room = 'Chưa xác định';
      if (row.class_name && row.class_name.includes('|')) {
        const parts = row.class_name.split('|');
        className = parts[0].trim();
        room = parts[1].trim();
      }
      return {
        session_id: row.session_id,
        class_id: row.class_id,
        class_name: className,
        room: room,
        session_date: row.session_date,
        start_time: row.start_time,
        end_time: row.end_time,
        checkin_time: row.checkin_time,
        status: row.status
      };
    });

    res.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Database error in getStudentAttendanceHistory:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy dữ liệu' });
  }
};