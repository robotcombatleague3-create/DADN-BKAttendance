const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

// GET /api/classes
router.get('/', classController.getAllClasses);

module.exports = router;
