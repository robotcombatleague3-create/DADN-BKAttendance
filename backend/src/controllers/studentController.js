const StudentModel = require('../models/StudentModel');

exports.getAllStudents = async (req, res) => {
  try {
    const students = await StudentModel.getAllWithDetails();
    res.json({ success: true, data: students });
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
    // Cập nhật thông tin cơ bản
    if (name && code) {
      await StudentModel.updateStudent(id, name, code);
    }
    // Cập nhật RFID nếu có truyền lên
    if (rfidUid !== undefined) {
      if (rfidUid === '') {
         // Nếu truyền lên rỗng, ta có thể xóa liên kết thẻ.
         // Tuy nhiên hàm assignRfid hiện tại dùng INSERT ON DUPLICATE KEY.
         // Ta sẽ tạm thời bỏ qua tính năng xóa thẻ để giữ đơn giản, hoặc cập nhật logic nếu cần.
      } else {
         await StudentModel.assignRfid(id, rfidUid);
      }
    }
    res.json({ success: true, message: 'Cập nhật sinh viên thành công' });
  } catch (error) {
    console.error('Database error in updateStudent:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi cập nhật thông tin' });
  }
};

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await StudentModel.deleteStudent(id);
    res.json({ success: true, message: 'Xóa sinh viên thành công' });
  } catch (error) {
    console.error('Database error in deleteStudent:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xóa sinh viên' });
  }
};
