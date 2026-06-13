const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// GET /api/stats/class/:classId
router.get('/class/:classId', attendanceController.getClassStats);
router.get('/', attendanceController.getOverallStats);

module.exports = router;
