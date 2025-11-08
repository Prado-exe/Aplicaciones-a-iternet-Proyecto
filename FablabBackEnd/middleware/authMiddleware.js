//Solo para rutas protegidas
const jwt = require('jsonwebtoken');

exports.verificarToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ error: 'Acceso denegado, token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // se guarda del usuario el { id, tipo }
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
};
