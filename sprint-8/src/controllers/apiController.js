const db = require('../database/models');

module.exports = {
  async getUsersList(req, res, next) {
    try {
      const users = await db.User.findAll();
      const mappedUsers = users.map(u => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        detail: `${req.protocol}://${req.get('host')}/api/users/${u.id}`
      }));
      
      res.json({
        count: users.length,
        users: mappedUsers
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserDetail(req, res, next) {
    try {
      const user = await db.User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const userJson = user.get({ plain: true });
      delete userJson.password;
      delete userJson.category;

      const host = `${req.protocol}://${req.get('host')}`;
      userJson.imageUrl = user.image ? (user.image.startsWith('http') ? user.image : `${host}${user.image}`) : `${host}/public/images/users/placeholder.png`;

      res.json(userJson);
    } catch (error) {
      next(error);
    }
  },

  async getProductsList(req, res, next) {
    try {
      const products = await db.Product.findAll({ include: ['category'] });
      const categories = await db.Category.findAll({ include: ['products'] });

      const countByCategory = {};
      categories.forEach(c => {
        countByCategory[c.name] = c.products ? c.products.length : 0;
      });

      const mappedProducts = products.map(p => ({
        id: p.id,
        name: p.title,
        description: p.description,
        categories: p.category ? [p.category.name] : [],
        detail: `${req.protocol}://${req.get('host')}/api/products/${p.id}`
      }));

      res.json({
        count: products.length,
        countByCategory,
        products: mappedProducts
      });
    } catch (error) {
      next(error);
    }
  },

  async getProductDetail(req, res, next) {
    try {
      const product = await db.Product.findByPk(req.params.id, { include: ['category'] });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      const pJson = product.get({ plain: true });
      
      const host = `${req.protocol}://${req.get('host')}`;
      pJson.imageUrl = product.image ? (product.image.startsWith('http') ? product.image : `${host}${product.image}`) : `${host}/public/images/placeholder.png`;
      pJson.categories = product.category ? [product.category] : [];

      res.json(pJson);
    } catch (error) {
      next(error);
    }
  }
};
