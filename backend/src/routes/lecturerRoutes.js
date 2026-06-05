const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');

// GET /api/lecturers
router.get('/', lecturerController.getAllLecturers);

module.exports = router;
