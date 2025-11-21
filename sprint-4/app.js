const path = require('path');
const express = require('express');
const app = express();

// Controllers
const productController = require('./src/controllers/productController');
const { readJSON } = require('./src/helpers/jsonHandler');

// Settings and Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method override middleware para soportar PUT y DELETE desde formularios HTML
app.use((req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
  }
  next();
});

// Serve styles from local src/styles
app.use('/styles', express.static(path.join(__dirname, 'src', 'styles')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes

// Home
app.get('/', (req, res) => {
  const products = readJSON('products.json');
  res.render('home', { products });
});

// Products CRUD
app.get('/products', productController.getAllProducts);
app.get('/products/create', productController.getCreateForm);
app.post('/products', productController.createProduct);
app.get('/products/:id', productController.getProductById);
app.get('/products/:id/edit', productController.getEditForm);
app.put('/products/:id', productController.updateProduct);
app.post('/products/:id', productController.updateProduct); // Para formularios HTML (con _method)
app.delete('/products/:id', productController.deleteProduct);

// Users placeholders
app.get('/login', (req, res) => res.render('users/login'));
app.get('/register', (req, res) => res.render('users/register'));
app.get('/shopping-cart', (req, res) => res.render('shopping-cart'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
