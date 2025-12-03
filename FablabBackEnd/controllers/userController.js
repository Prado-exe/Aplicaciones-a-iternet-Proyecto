const Usuario = require('../models/User');
const userService = require('../services/user.service');
const User = require("../models/User");
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

//admin ola
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select("-password"); // ocultar pass

    res.json({
      ok: true,
      usuarios
    });
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
};

// OBTENER USUARIO POR ID
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ usuario });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// ACTUALIZAR USUARIO POR ADMIN
exports.actualizarUsuarioPorAdmin = async (req, res) => {
  try {
    await Usuario.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "Usuario actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// ELIMINAR USUARIO
exports.eliminarUsuario = async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ msg: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar usuario" });
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