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