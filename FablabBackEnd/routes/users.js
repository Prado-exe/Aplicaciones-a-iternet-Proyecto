const express = require('express');
const router = express.Router();

const {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  actualizarPerfil,
  cambiarPassword,
  listarUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuarioPorAdmin,
  eliminarUsuario,
  forgotPassword,
  resetPassword
} = require('../controllers/userController');
const { verificarToken } = require('../middleware/authMiddleware');
const { verificarAdmin } = require('../middleware/adminMiddleware');


// ========== RUTAS DE USUARIO ==========

// Registro
router.post('/register', registrarUsuario);

// Login
router.post('/login', loginUsuario);

// Perfil del usuario logueado
router.get('/perfil', verificarToken, obtenerPerfil);

// Actualizar perfil
router.put('/perfil', verificarToken, actualizarPerfil);

// Cambiar contraseña
router.put('/cambiar-password', verificarToken, cambiarPassword);


// ========== RUTAS SOLO PARA ADMIN ==========

// Listar todos los usuarios
router.get('/listar', verificarToken, verificarAdmin, listarUsuarios);

// Obtener usuario por ID
router.get('/:id', verificarToken, verificarAdmin, obtenerUsuarioPorId);

// Actualizar usuario por ID
router.put('/:id', verificarToken, verificarAdmin, actualizarUsuarioPorAdmin);

// Eliminar usuario
router.delete('/:id', verificarToken, verificarAdmin, eliminarUsuario);

//Para Resetar Contraseñas
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
