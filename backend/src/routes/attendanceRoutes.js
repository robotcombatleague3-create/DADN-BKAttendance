const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// GET /api/attendance/history
router.get('/history', attendanceController.getHistory);

// GET /api/attendance/student/:studentId
router.get('/student/:studentId', attendanceController.getStudentAttendanceHistory);

// GET /api/attendance/class/:classId
router.get('/class/:classId', attendanceController.getClassAttendance);



// POST /api/attendance/scan
router.post('/scan', attendanceController.scanCard);

module.exports = router;
