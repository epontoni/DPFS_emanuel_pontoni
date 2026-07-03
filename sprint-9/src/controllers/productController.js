const { validationResult } = require('express-validator');
const db = require('../database/models');
const { Op } = require('sequelize');

/**
 * GET /products - Listado de productos (soporta búsqueda opcional con query ?search=...)
 */
const getAllProducts = async (req, res, next) => {
  try {
    const { search } = req.query;
    let whereClause = {};
    
    if (search) {
      whereClause = {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const products = await db.Product.findAll({
      where: whereClause,
      include: ['category']
    });

    const productsMapped = products.map(p => {
      const pJson = p.get({ plain: true });
      pJson.category = p.category ? p.category.name : '';
      return pJson;
    });

    res.render('products/index', { products: productsMapped, search: search || '' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /products/:id - Detalle del producto
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await db.Product.findByPk(req.params.id, { include: ['category'] });
    
    if (!product) {
      return res.status(404).render('error', { message: 'Producto no encontrado' });
    }
    
    const pJson = product.get({ plain: true });
    pJson.category = product.category ? product.category.name : '';

    res.render('products/show', { product: pJson });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /products/create - Vista para crear producto
 */
const getCreateForm = (req, res) => {
  res.render('products/create', { errors: {}, oldData: {} });
};

/**
 * POST /products - Crear producto
 */
const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('products/create', {
        errors: errors.mapped(),
        oldData: req.body
      });
    }

    const { name, description, image, category, colors, price } = req.body;
    
    const [categoryObj] = await db.Category.findOrCreate({
      where: { name: (category || 'Sin categoría').trim() }
    });

    const newProduct = await db.Product.create({
      title: name,
      price: parseFloat(price) || 0.0,
      description,
      image: image || '/images/placeholder.png',
      categoryId: categoryObj.id,
      colors: colors || ''
    });
    
    res.redirect(`/products/${newProduct.id}`);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /products/:id/edit - Vista para editar producto
 */
const getEditForm = async (req, res, next) => {
  try {
    const product = await db.Product.findByPk(req.params.id, { include: ['category'] });
    
    if (!product) {
      return res.status(404).render('error', { message: 'Producto no encontrado' });
    }
    
    const pJson = product.get({ plain: true });
    pJson.category = product.category ? product.category.name : '';

    res.render('products/edit', { product: pJson, errors: {} });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /products/:id - Actualizar producto
 */
const updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const product = await db.Product.findByPk(req.params.id, { include: ['category'] });
    
    if (!product) {
      return res.status(404).render('error', { message: 'Producto no encontrado' });
    }

    if (!errors.isEmpty()) {
      const pJson = product.get({ plain: true });
      pJson.category = product.category ? product.category.name : '';
      const mergedProduct = {
        ...pJson,
        ...req.body,
        title: req.body.name // Map 'name' from form back to 'title'
      };
      return res.status(400).render('products/edit', {
        product: mergedProduct,
        errors: errors.mapped()
      });
    }

    const { name, description, image, category, colors, price } = req.body;

    let categoryId = product.categoryId;
    if (category) {
      const [categoryObj] = await db.Category.findOrCreate({
        where: { name: category.trim() }
      });
      categoryId = categoryObj.id;
    }
    
    await product.update({
      title: name,
      price: parseFloat(price) || product.price,
      description,
      image: image || product.image,
      categoryId,
      colors: colors || product.colors
    });
    
    res.redirect(`/products/${product.id}`);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /products/:id - Eliminar producto
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await db.Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).render('error', { message: 'Producto no encontrado' });
    }
    
    await product.destroy();
    
    res.redirect('/products?message=Producto+eliminado+correctamente');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getCreateForm,
  createProduct,
  getEditForm,
  updateProduct,
  deleteProduct,
};
