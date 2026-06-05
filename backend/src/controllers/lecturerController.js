const LecturerModel = require('../models/LecturerModel');

exports.getAllLecturers = async (req, res) => {
  try {
    const lecturers = await LecturerModel.getAll();
    res.json({ success: true, data: lecturers });
  } catch (error) {
    console.error('Database error in getAllLecturers:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách giảng viên' });
  }
};
