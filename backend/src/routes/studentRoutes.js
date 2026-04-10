const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// GET /api/students
router.get('/', studentController.getAllStudents);

// PUT /api/students/:id/rfid
router.put('/:id/rfid', studentController.assignRfid);

module.exports = router;
