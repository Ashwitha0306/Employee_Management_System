// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

// Register (admin or employee)
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

module.exports = router;
