const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');
const { verifyToken } = require('../middlewares/authMiddleware');


// GET /api/lecturers/profile/:userId
router.get('/profile/:userId', verifyToken, lecturerController.getProfile);

// PUT /api/lecturers/profile/:userId
router.put('/profile/:userId', verifyToken, lecturerController.updateProfile);

// GET /api/lecturers/history/:userId
router.get('/history/:userId', verifyToken, lecturerController.getTeachingHistory);

// GET /api/lecturers
router.get('/', verifyToken, lecturerController.getAllLecturers);

// POST /api/lecturers
router.post('/', verifyToken, lecturerController.createLecturer);

// PUT /api/lecturers/user/:userId
router.put('/user/:userId', verifyToken, lecturerController.updateLecturer);

// DELETE /api/lecturers/:lecturerId
router.delete('/:lecturerId', verifyToken, lecturerController.deleteLecturer);

module.exports = router;
