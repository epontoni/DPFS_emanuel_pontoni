module.exports = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.status(403).render('error', { 
    message: 'Acceso denegado: Se requieren permisos de administrador para realizar esta acción.' 
  });
};
