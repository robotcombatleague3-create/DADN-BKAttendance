const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// GET /api/students
router.get('/', studentController.getAllStudents);

// POST /api/students/sync-hardware
router.post('/sync-hardware', studentController.syncHardware);

// PUT /api/students/:id/rfid
router.put('/:id/rfid', studentController.assignRfid);

// PUT /api/students/:id
router.put('/:id', studentController.updateStudent);

// DELETE /api/students/:id
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
