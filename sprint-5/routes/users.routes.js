const express = require('express');
const router = express.Router();
const usersController = require('../src/controllers/usersController');
const guestMiddleware = require('../src/middlewares/guestMiddleware');
const authMiddleware = require('../src/middlewares/authMiddleware');

// Register
router.get('/register', guestMiddleware, usersController.registerForm);
router.post('/register', usersController.upload.single('image'), usersController.processRegister);

// Login
router.get('/login', guestMiddleware, usersController.loginForm);
router.post('/login', usersController.processLogin);

// Profile
router.get('/users/profile', authMiddleware, usersController.profile);

// Logout
router.get('/logout', usersController.logout);

module.exports = router;