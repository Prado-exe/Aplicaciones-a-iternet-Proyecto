const Usuario = require('../models/User');
const userService = require('../services/user.service');

//Registrar Usuario
exports.registrarUsuario = async (req, res, next) => {
  try {
    const data = await userService.createUser(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

//Login Usuario
exports.loginUsuario = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

//Perfil usuario(protegido)
exports.obtenerPerfil = async (req, res, next) => {
  try {
    const data = await userService.getProfile(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

//Actualizar datos del perfil
exports.actualizarPerfil = async (req, res, next) => {
  try {
    const data = await userService.updateProfile(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

//Actualizar Password(Estando Logeado)
exports.cambiarPassword = async (req, res, next) => {
  try {
    const data = await userService.changePassword(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

//Olvidar contraseña (Deslogeado)
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await userService.forgotPassword({email});

    res.json({
      success: true,
      message: "Si el correo está registrado, recibirás instrucciones.",
    });
  } catch (err) {
    next(err);
  }
};

// Resetear contraseña con token (desde enlace del correo)
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    await userService.resetPassword({token, newPassword});

    res.json({
      success: true,
      message: "Contraseña actualizada correctamente",
    });
  } catch (err) {
    next(err);
  }
};