const path = require('path');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

// Database models
const db = require('./src/database/models');

// Controllers
const productController = require('./src/controllers/productController');

// Routes
const userRoutes = require('./routes/users.routes');
const apiRoutes = require('./routes/api.routes');
const cartRoutes = require('./routes/cart.routes');

// Middlewares
const checkUserCookie = require('./src/middlewares/checkUserCookieMiddleware');
const productValidator = require('./src/middlewares/productValidator');
const adminMiddleware = require('./src/middlewares/adminMiddleware');
const i18nMiddleware = require('./src/middlewares/i18nMiddleware');

// Settings and Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(cors()); // Habilitar CORS para consultas del Dashboard React
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: 'makerhub-secret', resave: false, saveUninitialized: false }));
app.use(i18nMiddleware);

// Method override middleware para soportar PUT y DELETE desde formularios HTML
app.use((req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
  }
  next();
});

// Expose logged user to views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Check cookie for automatic login
app.use(checkUserCookie);

// Serve styles from local src/styles
app.use('/styles', express.static(path.join(__dirname, 'src', 'styles')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes

// Home
app.get('/', async (req, res, next) => {
  try {
    const products = await db.Product.findAll({ include: ['category'] });
    const productsMapped = products.map(p => {
      const pJson = p.get({ plain: true });
      pJson.category = p.category ? p.category.name : '';
      return pJson;
    });
    res.render('home', { products: productsMapped });
  } catch (error) {
    next(error);
  }
});

// Products CRUD
app.get('/products', productController.getAllProducts);
app.get('/products/create', adminMiddleware, productController.getCreateForm);
app.post('/products', adminMiddleware, productValidator, productController.createProduct);
app.get('/products/:id', productController.getProductById);
app.get('/products/:id/edit', adminMiddleware, productController.getEditForm);
app.put('/products/:id', adminMiddleware, productValidator, productController.updateProduct);
app.post('/products/:id', adminMiddleware, productValidator, productController.updateProduct); // Para formularios HTML (con _method)
app.delete('/products/:id', adminMiddleware, productController.deleteProduct);

// Mount user routes
app.use('/', userRoutes);

// Mount cart routes
app.use('/', cartRoutes);

// Mount APIs
app.use('/api', apiRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
