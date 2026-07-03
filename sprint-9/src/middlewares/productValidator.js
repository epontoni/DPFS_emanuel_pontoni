const { body } = require('express-validator');
const path = require('path');

module.exports = [
  body('name')
    .notEmpty().withMessage('El nombre del producto es obligatorio')
    .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres'),
  
  body('description')
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 20 }).withMessage('La descripción debe tener al menos 20 caracteres'),
    
  body('image').custom((value) => {
    if (value) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
      let fileExtension = '';
      try {
        const urlPath = new URL(value).pathname;
        fileExtension = path.extname(urlPath).toLowerCase();
      } catch (err) {
        fileExtension = path.extname(value).toLowerCase();
      }
      if (!allowedExtensions.includes(fileExtension)) {
        throw new Error('Solo se permiten formatos de imagen válidos (JPG, JPEG, PNG, GIF)');
      }
    }
    return true;
  })
];
