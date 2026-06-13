const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken } = require('../middlewares/authMiddleware');


// GET /api/attendance/history
router.get('/history', verifyToken, attendanceController.getHistory);

// GET /api/attendance/student/:studentId
router.get('/student/:studentId', verifyToken, attendanceController.getStudentAttendanceHistory);

// GET /api/attendance/class/:classId
router.get('/class/:classId', verifyToken, attendanceController.getClassAttendance);



// POST /api/attendance/scan
router.post('/scan', verifyToken, attendanceController.scanCard);

module.exports = router;
