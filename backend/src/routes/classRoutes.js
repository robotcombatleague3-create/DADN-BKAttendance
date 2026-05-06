const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// GET /api/classes
router.get('/', attendanceController.getClasses);

module.exports = router;
