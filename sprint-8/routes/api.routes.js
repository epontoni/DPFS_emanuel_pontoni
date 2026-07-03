const express = require('express');
const router = express.Router();
const apiController = require('../src/controllers/apiController');

// Users API
router.get('/users', apiController.getUsersList);
router.get('/users/:id', apiController.getUserDetail);

// Products API
router.get('/products', apiController.getProductsList);
router.get('/products/:id', apiController.getProductDetail);

module.exports = router;
