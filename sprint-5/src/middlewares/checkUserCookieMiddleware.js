const path = require('path');
const { readFileSync } = require('fs');

function readUsers() {
  try {
    const dataPath = path.join(__dirname, '..', 'data', 'users.json');
    const content = readFileSync(dataPath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
}

module.exports = (req, res, next) => {
  if (!req.session.user && req.cookies && req.cookies.userEmail) {
    const users = readUsers();
    const user = users.find(u => u.email === req.cookies.userEmail);
    if (user) {
      // attach safe user data to session
      req.session.user = {
        id: user.id,
        firstName: user.firstName || user.name || '',
        lastName: user.lastName || '',
        email: user.email,
        image: user.image || null,
        role: user.role || 'user'
      };
    }
  }
  next();
};