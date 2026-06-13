const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const attendanceController = require('../controllers/attendanceController');
const { verifyToken } = require('../middlewares/authMiddleware');


// GET /api/classes/lecturer?lecturerId=...
router.get('/lecturer', verifyToken, attendanceController.getClasses);

// GET /api/classes
router.get('/', verifyToken, classController.getAllClasses);

module.exports = router;
