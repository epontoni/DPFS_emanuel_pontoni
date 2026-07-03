const express = require('express');
const router = express.Router();
const cartController = require('../src/controllers/cartController');
const authMiddleware = require('../src/middlewares/authMiddleware');

// Shopping Cart Actions
router.post('/cart/add/:id', cartController.addToCart);
router.post('/cart/remove/:id', cartController.removeFromCart);
router.post('/cart/update/:id', cartController.updateQuantity);

// Cart Page
router.get('/shopping-cart', cartController.renderCart);

// Checkout
router.get('/checkout', authMiddleware, cartController.renderCheckout);
router.post('/checkout', authMiddleware, cartController.processCheckout);
router.get('/checkout/success', authMiddleware, cartController.renderSuccess);

module.exports = router;
