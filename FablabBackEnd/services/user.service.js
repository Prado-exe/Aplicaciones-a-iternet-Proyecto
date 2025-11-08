//Logica y BD
const Usuario = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Crear Usuario
exports.createUser = async ({ NombreUsuario, CorreoUsuario, ContraUsuario }) => {
  if (!NombreUsuario || !CorreoUsuario || !ContraUsuario) {
    const e = new Error('Faltan campos'); e.status = 400; throw e;
  }
  CorreoUsuario = CorreoUsuario.trim().toLowerCase();

  const existe = await Usuario.findOne({ CorreoUsuario }).lean();
  if (existe) { const e = new Error('El correo ya está registrado'); e.status = 409; throw e; }

  const doc = await Usuario.create({ NombreUsuario, CorreoUsuario, ContraUsuario });
  const { ContraUsuario: _, ...safe } = doc.toObject();
  return safe;
};

//Login usuario
exports.login = async ({ CorreoUsuario, ContraUsuario }) => {
  if (!CorreoUsuario || !ContraUsuario) {
    const e = new Error('Faltan credenciales'); e.status = 400; throw e;
  }

  const correo = CorreoUsuario.trim().toLowerCase();

  // Trae la contraseña 
  const user = await Usuario.findOne({ CorreoUsuario: correo }).select('+ContraUsuario');
  if (!user) { const e = new Error('Credenciales inválidas'); e.status = 401; throw e; }

  const ok = await bcrypt.compare(ContraUsuario, user.ContraUsuario);
  if (!ok) { const e = new Error('Credenciales inválidas'); e.status = 401; throw e; }

  // Ultima sesion
  user.FechaUltimaSesion = new Date();
  await user.save();

  // JWT -- Token de la sesion del usuario
  const token = jwt.sign(
    { id: user._id, tipo: user.TipoUsuario },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  const { ContraUsuario: _, __v, ...safe } = user.toObject();
  return { token, user: safe };
};

//Obetener perfil usuario //
exports.getProfile = async (userId) => {
  const user = await Usuario
    .findById(userId)
    .select('-ContraUsuario -__v')
    .lean();

  if (!user) {
    const e = new Error('Usuario no encontrado');
    e.status = 404;
    throw e;
  }
  return user;
};