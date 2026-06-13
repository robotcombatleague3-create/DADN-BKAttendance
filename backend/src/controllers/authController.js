const db = require('../config/db');
const jwt = require('jsonwebtoken');


exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Sai email hoặc mật khẩu' });
    }

    const user = rows[0];
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Sai email hoặc mật khẩu' });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'your_default_secret_key',
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token
      }
    });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};
