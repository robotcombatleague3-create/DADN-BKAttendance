const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// GET /api/attendance
router.get('/', attendanceController.getHistory);

// POST /api/attendance/scan
router.post('/scan', attendanceController.scanCard);

module.exports = router;
