const express = require('express');
const router = express.Router();
const usersController = require('../src/controllers/usersController');
const guestMiddleware = require('../src/middlewares/guestMiddleware');
const authMiddleware = require('../src/middlewares/authMiddleware');
const adminMiddleware = require('../src/middlewares/adminMiddleware');
const registerValidator = require('../src/middlewares/registerValidator');
const loginValidator = require('../src/middlewares/loginValidator');

// Register
router.get('/register', guestMiddleware, usersController.registerForm);
router.post('/register', usersController.upload.single('image'), registerValidator, usersController.processRegister);

// Login
router.get('/login', guestMiddleware, usersController.loginForm);
router.post('/login', loginValidator, usersController.processLogin);

// Profile
router.get('/users/profile', authMiddleware, usersController.profile);

// Logout
router.get('/logout', usersController.logout);

// User Administration (Admin only)
router.get('/users', adminMiddleware, usersController.listUsers);
router.post('/users/:id/delete', adminMiddleware, usersController.deleteUser);

module.exports = router;