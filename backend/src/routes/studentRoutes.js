const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken } = require('../middlewares/authMiddleware');


// GET /api/students
router.get('/', verifyToken, studentController.getAllStudents);

// POST /api/students
router.post('/', verifyToken, studentController.createStudent);

// POST /api/students/sync-hardware
router.post('/sync-hardware', verifyToken, studentController.syncHardware);

// PUT /api/students/:id/rfid
router.put('/:id/rfid', verifyToken, studentController.assignRfid);

// PUT /api/students/:id
router.put('/:id', verifyToken, studentController.updateStudent);

// DELETE /api/students/:id
router.delete('/:id', verifyToken, studentController.deleteStudent);

module.exports = router;
