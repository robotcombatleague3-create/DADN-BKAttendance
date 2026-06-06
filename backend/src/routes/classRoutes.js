const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const attendanceController = require('../controllers/attendanceController');

// GET /api/classes/lecturer?lecturerId=...
router.get('/lecturer', attendanceController.getClasses);

// GET /api/classes
router.get('/', classController.getAllClasses);

module.exports = router;
