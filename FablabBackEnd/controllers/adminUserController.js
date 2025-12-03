const Usuario = require('../models/User');

// Obtener todos
exports.listarUsuarios = async (req, res) => {
  const usuarios = await Usuario.find();
  res.json({ usuarios });
};

// Obtener uno
exports.obtenerUsuarioPorId = async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  res.json({ usuario });
};

// Actualizar
exports.actualizarUsuarioPorId = async (req, res) => {
  await Usuario.findByIdAndUpdate(req.params.id, req.body);
  res.json({ msg: "Usuario actualizado" });
};

// Eliminar
exports.eliminarUsuario = async (req, res) => {
  await Usuario.findByIdAndDelete(req.params.id);
  res.json({ msg: "Usuario eliminado" });
};
