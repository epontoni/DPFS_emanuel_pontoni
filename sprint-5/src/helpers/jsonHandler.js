const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

/**
 * Lee un archivo JSON y retorna los datos parseados
 * @param {string} filename - Nombre del archivo (ej: 'products.json')
 * @returns {Array} Datos del archivo JSON
 */
const readJSON = (filename) => {
  try {
    const filePath = path.join(dataDir, filename);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

/**
 * Escribe datos en un archivo JSON
 * @param {string} filename - Nombre del archivo (ej: 'products.json')
 * @param {Array} data - Datos a escribir
 * @returns {boolean} true si fue exitoso, false si falló
 */
const writeJSON = (filename, data) => {
  try {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

module.exports = {
  readJSON,
  writeJSON,
};
