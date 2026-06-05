const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// GET /api/attendance/history
router.get('/history', attendanceController.getHistory);

// GET /api/attendance/class/:classId
router.get('/class/:classId', attendanceController.getClassAttendance);

// GET /api/attendance/stats
router.get('/stats', attendanceController.getOverallStats);

// POST /api/attendance/scan
router.post('/scan', attendanceController.scanCard);

module.exports = router;
