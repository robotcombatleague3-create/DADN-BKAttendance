const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');

// GET /api/lecturers/profile/:userId
router.get('/profile/:userId', lecturerController.getProfile);

// PUT /api/lecturers/profile/:userId
router.put('/profile/:userId', lecturerController.updateProfile);

// GET /api/lecturers/history/:userId
router.get('/history/:userId', lecturerController.getTeachingHistory);

// GET /api/lecturers
router.get('/', lecturerController.getAllLecturers);

module.exports = router;
