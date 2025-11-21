const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const multer = require('multer');

const usersDataPath = path.join(__dirname, '..', 'data', 'users.json');

function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(usersDataPath, 'utf8')) || [];
  } catch (err) {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(usersDataPath, JSON.stringify(users, null, 2));
}

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'public', 'images', 'users'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

const upload = multer({ storage });

module.exports = {
  upload,

  registerForm(req, res) {
    res.render('users/register');
  },

  async processRegister(req, res) {
    // multer middleware already processed file
    const { firstName, lastName, email, password, category } = req.body;
    const image = req.file ? '/public/images/users/' + req.file.filename : null;

    // Validaciones simples
    if (!firstName || !lastName || !email || !password || !category) {
      return res.status(400).render('users/register', { error: 'Todos los campos son obligatorios' });
    }

    const users = readUsers();
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).render('users/register', { error: 'El email ya está en uso' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length ? users[users.length - 1].id + 1 : 1,
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashed,
      category,
      image,
      createdAt: new Date()
    };

    users.push(newUser);
    writeUsers(users);

    res.redirect('/login');
  },

  loginForm(req, res) {
    res.render('users/login');
  },

  async processLogin(req, res) {
    const { email, password, remember } = req.body;
    if (!email || !password) {
      return res.status(400).render('users/login', { error: 'Email y contraseña son obligatorios' });
    }
    const users = readUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).render('users/login', { error: 'Credenciales inválidas' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).render('users/login', { error: 'Credenciales inválidas' });
    }

    // save safe user into session
    req.session.user = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image || null,
      role: user.role || 'user'
    };

    if (remember) {
      res.cookie('userEmail', user.email, { maxAge: 1000 * 60 * 60 * 24 * 30 }); // 30 días
    }

    res.redirect('/');
  },

  profile(req, res) {
    if (!req.session.user) return res.redirect('/login');
    const users = readUsers();
    const user = users.find(u => u.id === req.session.user.id);
    res.render('users/profile', { user });
  },

  logout(req, res) {
    res.clearCookie('userEmail');
    req.session.destroy(err => {
      res.redirect('/');
    });
  }
};