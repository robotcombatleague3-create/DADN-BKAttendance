const db = require('../config/db');
const LecturerModel = require('../models/LecturerModel');

// 1. Lấy thông tin Hồ sơ Giảng viên
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const query = `
      SELECT 
        u.user_id,
        u.name,
        u.email,
        u.role,
        l.lecturer_id,
        l.department,
        l.specialization,
        rc.rfid_uid
      FROM users u
      JOIN lecturers l ON u.user_id = l.user_id
      LEFT JOIN rfid_cards rc ON rc.user_id = u.user_id
      WHERE u.user_id = ?
    `;

    const [rows] = await db.execute(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giảng viên' });
    }

    const data = rows[0];
    
    // Formatting response
    res.json({ 
      success: true, 
      data: {
        user_id: data.user_id,
        lecturer_id: data.lecturer_id,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        specialization: data.specialization,
        rfid_uid: data.rfid_uid || null
      }
    });
  } catch (error) {
    console.error('Database error in getProfile:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy hồ sơ giảng viên' });
  }
};

// 2. Cập nhật thông tin Giảng viên
exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, department, specialization } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Tên giảng viên là bắt buộc' });
    }

    // Kiểm tra xem giảng viên có tồn tại
    const [lecturerRows] = await db.execute('SELECT lecturer_id FROM lecturers WHERE user_id = ?', [userId]);
    
    if (lecturerRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giảng viên' });
    }
    
    const lecturerId = lecturerRows[0].lecturer_id;

    // Update bảng users
    await db.execute('UPDATE users SET name = ? WHERE user_id = ?', [name, userId]);

    // Update bảng lecturers
    await db.execute(
      'UPDATE lecturers SET department = ?, specialization = ? WHERE lecturer_id = ?',
      [department || null, specialization || null, lecturerId]
    );

    res.json({ success: true, message: 'Cập nhật hồ sơ thành công' });
  } catch (error) {
    console.error('Database error in updateProfile:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi cập nhật hồ sơ' });
  }
};

// 3. Lấy lịch sử giảng dạy (điểm danh) của Giảng viên
exports.getTeachingHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Tìm lecturer_id từ user_id
    const [lecturerRows] = await db.execute('SELECT lecturer_id FROM lecturers WHERE user_id = ?', [userId]);
    
    if (lecturerRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giảng viên' });
    }
    
    const lecturerId = lecturerRows[0].lecturer_id;

    // Query các buổi học thuộc các lớp do lecturer này phụ trách
    const query = `
      SELECT 
        ss.session_id,
        c.class_name,
        ss.session_date,
        ss.start_time,
        ss.end_time
      FROM sessions ss
      JOIN classes c ON ss.class_id = c.class_id
      WHERE c.lecturer_id = ?
      ORDER BY ss.session_date DESC, ss.start_time DESC
    `;

    const [rows] = await db.execute(query, [lecturerId]);

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
        class_name: className,
        room: room,
        session_date: row.session_date,
        start_time: row.start_time,
        end_time: row.end_time
      };
    });

    res.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Database error in getTeachingHistory:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy lịch sử giảng dạy' });
  }
};

exports.getAllLecturers = async (req, res) => {
  try {
    const lecturers = await LecturerModel.getAll();
    res.json({ success: true, data: lecturers });
  } catch (error) {
    console.error('Database error in getAllLecturers:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách giảng viên' });
  }
};
