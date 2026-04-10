const Student = require('../models/Student');

exports.getAllStudents = (req, res) => {
  const students = Student.getAll();
  res.json({ success: true, data: students });
};

exports.assignRfid = (req, res) => {
  const { id } = req.params;
  const { rfidUid } = req.body;

  if (!rfidUid) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mã RFID' });
  }

  const updatedStudent = Student.assignRfid(id, rfidUid);
  if (updatedStudent) {
    res.json({ success: true, message: 'Gán thẻ thành công', data: updatedStudent });
  } else {
    res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên' });
  }
};
