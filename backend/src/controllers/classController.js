const ClassModel = require('../models/ClassModel');

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await ClassModel.getAllClasses();
    res.json({ success: true, data: classes });
  } catch (error) {
    console.error('Database error in getAllClasses:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách lớp học' });
  }
};
