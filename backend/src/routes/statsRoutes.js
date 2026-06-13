const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken } = require('../middlewares/authMiddleware');


// GET /api/stats/class/:classId
router.get('/class/:classId', verifyToken, attendanceController.getClassStats);
router.get('/', verifyToken, attendanceController.getOverallStats);

module.exports = router;
