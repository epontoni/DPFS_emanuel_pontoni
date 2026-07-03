const db = require('../database/models');

module.exports = async (req, res, next) => {
  try {
    if (!req.session.user && req.cookies && req.cookies.userEmail) {
      const user = await db.User.findOne({ where: { email: req.cookies.userEmail } });
      if (user) {
        req.session.user = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          image: user.image || null,
          role: user.category || 'user'
        };
      }
    }
  } catch (error) {
    console.error('Error in checkUserCookieMiddleware:', error);
  }
  next();
};