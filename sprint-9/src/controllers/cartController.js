const db = require('../database/models');

module.exports = {
  async addToCart(req, res, next) {
    try {
      const productId = parseInt(req.params.id);
      const product = await db.Product.findByPk(productId);
      if (!product) {
        return res.status(404).render('error', { message: 'Producto no encontrado' });
      }

      if (!req.session.cart) {
        req.session.cart = [];
      }

      const itemIndex = req.session.cart.findIndex(item => item.id === productId);
      if (itemIndex > -1) {
        req.session.cart[itemIndex].quantity += 1;
      } else {
        req.session.cart.push({
          id: product.id,
          title: product.title,
          price: parseFloat(product.price),
          image: product.image,
          quantity: 1
        });
      }

      res.redirect('/shopping-cart');
    } catch (error) {
      next(error);
    }
  },

  removeFromCart(req, res) {
    const productId = parseInt(req.params.id);
    if (req.session.cart) {
      req.session.cart = req.session.cart.filter(item => item.id !== productId);
    }
    res.redirect('/shopping-cart');
  },

  updateQuantity(req, res) {
    const productId = parseInt(req.params.id);
    const quantity = parseInt(req.body.quantity);
    if (req.session.cart && quantity > 0) {
      const itemIndex = req.session.cart.findIndex(item => item.id === productId);
      if (itemIndex > -1) {
        req.session.cart[itemIndex].quantity = quantity;
      }
    }
    res.redirect('/shopping-cart');
  },

  renderCart(req, res) {
    const cart = req.session.cart || [];
    let subtotal = 0;
    cart.forEach(item => {
      subtotal += item.price * item.quantity;
    });
    res.render('shopping-cart', { cart, subtotal });
  },

  renderCheckout(req, res) {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    const cart = req.session.cart || [];
    if (cart.length === 0) {
      return res.redirect('/shopping-cart');
    }
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;
    });
    res.render('checkout', { cart, total });
  },

  async processCheckout(req, res, next) {
    try {
      if (!req.session.user) {
        return res.redirect('/login');
      }
      const cart = req.session.cart || [];
      if (cart.length === 0) {
        return res.redirect('/shopping-cart');
      }

      const { address, city, zip, paymentMethod } = req.body;
      const fullAddress = `${address}, ${city} (${zip})`;

      let total = 0;
      cart.forEach(item => {
        total += item.price * item.quantity;
      });

      // Create Order
      const order = await db.Order.create({
        userId: req.session.user.id,
        total: total,
        status: 'completed',
        shippingAddress: fullAddress,
        paymentMethod: paymentMethod || 'credit_card'
      });

      // Create OrderItems
      for (const item of cart) {
        await db.OrderItem.create({
          orderId: order.id,
          productId: item.id,
          price: item.price,
          quantity: item.quantity
        });
      }

      // Clear cart
      req.session.cart = [];

      res.redirect('/checkout/success');
    } catch (error) {
      next(error);
    }
  },

  renderSuccess(req, res) {
    res.render('success');
  }
};
