//este middleware se encarga de verificar que la cuenta sea de admin realmente
exports.verificarAdmin = (req, res, next) => {
  if (!req.user || req.user.tipo !== 1) {
    return res.status(403).json({ error: "Acceso denegado. Requiere rol administrador." });
  }
  next();
};
