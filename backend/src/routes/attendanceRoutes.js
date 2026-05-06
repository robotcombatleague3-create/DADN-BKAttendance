const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// GET /api/attendance/history
router.get('/history', attendanceController.getHistory);

// GET /api/attendance/student/:studentId
router.get('/student/:studentId', attendanceController.getStudentAttendanceHistory);

// POST /api/attendance/scan
router.post('/scan', attendanceController.scanCard);

module.exports = router;
