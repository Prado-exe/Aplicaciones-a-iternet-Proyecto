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

//Actualizar Password
exports.cambiarPassword = async (req, res, next) => {
  try {
    const data = await userService.changePassword(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

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