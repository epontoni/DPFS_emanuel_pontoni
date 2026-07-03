const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { validationResult } = require('express-validator');
const db = require('../database/models');

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
    res.render('users/register', { errors: {}, oldData: {} });
  },

  async processRegister(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Delete uploaded file if validation failed
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).render('users/register', {
          errors: errors.mapped(),
          oldData: req.body
        });
      }

      const { firstName, lastName, email, password, category } = req.body;
      const image = req.file ? '/public/images/users/' + req.file.filename : null;

      const hashed = await bcrypt.hash(password, 10);
      await db.User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashed,
        category,
        image
      });

      res.redirect('/login');
    } catch (error) {
      next(error);
    }
  },

  loginForm(req, res) {
    res.render('users/login', { errors: {}, oldData: {} });
  },

  async processLogin(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render('users/login', {
          errors: errors.mapped(),
          oldData: req.body
        });
      }

      const { email, password, remember } = req.body;
      const user = await db.User.findOne({ where: { email: email.toLowerCase() } });
      
      if (!user) {
        return res.status(401).render('users/login', {
          errors: { email: { msg: 'Las credenciales ingresadas no coinciden con nuestros registros' } },
          oldData: req.body
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).render('users/login', {
          errors: { email: { msg: 'Las credenciales ingresadas no coinciden con nuestros registros' } },
          oldData: req.body
        });
      }

      // save safe user into session
      req.session.user = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image || null,
        role: user.category || 'user'
      };

      if (remember) {
        res.cookie('userEmail', user.email, { maxAge: 1000 * 60 * 60 * 24 * 30 }); // 30 días
      }

      res.redirect('/');
    } catch (error) {
      next(error);
    }
  },

  async profile(req, res, next) {
    try {
      if (!req.session.user) return res.redirect('/login');
      const user = await db.User.findByPk(req.session.user.id);
      res.render('users/profile', { user });
    } catch (error) {
      next(error);
    }
  },

  async listUsers(req, res, next) {
    try {
      const users = await db.User.findAll();
      res.render('users/list', { users });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const user = await db.User.findByPk(req.params.id);
      if (user) {
        if (user.image && !user.image.includes('placeholder')) {
          const filePath = path.join(__dirname, '..', '..', user.image);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        await user.destroy();
      }
      res.redirect('/users');
    } catch (error) {
      next(error);
    }
  },

  logout(req, res) {
    res.clearCookie('userEmail');
    req.session.destroy(err => {
      res.redirect('/');
    });
  }
};