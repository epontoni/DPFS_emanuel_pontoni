const { body } = require('express-validator');
const db = require('../database/models');
const path = require('path');

module.exports = [
  body('firstName')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  
  body('lastName')
    .notEmpty().withMessage('El apellido es obligatorio')
    .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres'),
  
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ingresar un formato de email válido')
    .custom(async (value) => {
      const user = await db.User.findOne({ where: { email: value.toLowerCase() } });
      if (user) {
        throw new Error('El email ya está registrado');
      }
      return true;
    }),
  
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    
  body('image').custom((value, { req }) => {
    if (req.file) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        throw new Error('Solo se permiten archivos de imagen (JPG, JPEG, PNG, GIF)');
      }
    }
    return true;
  })
];
