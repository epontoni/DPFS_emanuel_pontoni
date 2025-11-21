const { readJSON, writeJSON } = require('../helpers/jsonHandler');

/**
 * GET /products - Listado de productos
 */
const getAllProducts = (req, res) => {
  const products = readJSON('products.json');
  res.render('products/index', { products });
};

/**
 * GET /products/:id - Detalle del producto
 */
const getProductById = (req, res) => {
  const products = readJSON('products.json');
  const product = products.find(p => p.id === Number(req.params.id));
  
  if (!product) {
    return res.status(404).render('error', { message: 'Producto no encontrado' });
  }
  
  res.render('products/show', { product });
};

/**
 * GET /products/create - Vista para crear producto
 */
const getCreateForm = (req, res) => {
  res.render('products/create');
};

/**
 * POST /products - Crear producto
 */
const createProduct = (req, res) => {
  const { name, description, image, category, colors, price } = req.body;
  const products = readJSON('products.json');
  
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    title: name,
    price: parseFloat(price),
    description,
    image: image || '/images/placeholder.png',
    category: category || 'Sin categoría',
    colors: colors || '',
  };
  
  products.push(newProduct);
  writeJSON('products.json', products);
  
  res.redirect(`/products/${newProduct.id}`);
};

/**
 * GET /products/:id/edit - Vista para editar producto
 */
const getEditForm = (req, res) => {
  const products = readJSON('products.json');
  const product = products.find(p => p.id === Number(req.params.id));
  
  if (!product) {
    return res.status(404).render('error', { message: 'Producto no encontrado' });
  }
  
  res.render('products/edit', { product });
};

/**
 * PUT /products/:id - Actualizar producto
 */
const updateProduct = (req, res) => {
  const { name, description, image, category, colors, price } = req.body;
  const products = readJSON('products.json');
  const product = products.find(p => p.id === Number(req.params.id));
  
  if (!product) {
    return res.status(404).render('error', { message: 'Producto no encontrado' });
  }
  
  product.title = name;
  product.price = parseFloat(price);
  product.description = description;
  product.image = image || product.image;
  product.category = category || product.category;
  product.colors = colors || product.colors;
  
  writeJSON('products.json', products);
  
  res.redirect(`/products/${product.id}`);
};

/**
 * DELETE /products/:id - Eliminar producto
 */
const deleteProduct = (req, res) => {
  const products = readJSON('products.json');
  const productIndex = products.findIndex(p => p.id === Number(req.params.id));
  
  if (productIndex === -1) {
    return res.status(404).render('error', { message: 'Producto no encontrado' });
  }
  
  products.splice(productIndex, 1);
  writeJSON('products.json', products);
  
  res.redirect('/products?message=Producto eliminado correctamente');
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
