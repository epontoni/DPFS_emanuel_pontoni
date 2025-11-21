const path = require('path');
const express = require('express');
const app = express();

// Settings and Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.urlencoded({ extended: true }));

// Serve styles copied from sprint-2
// Serve styles from local src/styles (all CSS under src/styles)
app.use('/styles', express.static(path.join(__dirname, 'src', 'styles')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Sample in-memory products (migrated / simplified)
const products = [
  { id: 1, title: 'Bicicleta urbana', price: 349.99, image: '/images/bike-1.jpg', category: 'Bikes', description: 'Una bicicleta ideal para la ciudad.' },
  { id: 2, title: 'Casco deportivo', price: 49.90, image: '/images/helmet-1.jpg', category: 'Accesorios', description: 'Casco ligero y resistente.' },
];

// Routes
app.get('/', (req, res) => {
  res.render('home', { products });
});

app.get('/products', (req, res) => {
  res.render('products/index', { products });
});

app.get('/products/create', (req, res) => {
  res.render('products/create');
});

app.post('/products', (req, res) => {
  const { name, description, image, category, colors, price } = req.body;
  const id = products.length ? products[products.length - 1].id + 1 : 1;
  products.push({ id, title: name, price, description, image, category, colors });
  res.redirect('/products');
});

app.get('/products/:id', (req, res) => {
  const p = products.find(x => x.id === Number(req.params.id));
  if (!p) return res.status(404).send('Product not found');
  res.render('products/show', { product: p });
});

app.get('/products/:id/edit', (req, res) => {
  const p = products.find(x => x.id === Number(req.params.id));
  if (!p) return res.status(404).send('Product not found');
  res.render('products/edit', { product: p });
});

app.post('/products/:id', (req, res) => {
  const p = products.find(x => x.id === Number(req.params.id));
  if (!p) return res.status(404).send('Product not found');
  const { name, price, description, image, category, colors } = req.body;
  p.title = name; p.price = price; p.description = description; p.image = image; p.category = category; p.colors = colors;
  res.redirect('/products/' + p.id);
});

// Users placeholders
app.get('/login', (req, res) => res.render('users/login'));
app.get('/register', (req, res) => res.render('users/register'));
app.get('/shopping-cart', (req, res) => res.render('shopping-cart'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
