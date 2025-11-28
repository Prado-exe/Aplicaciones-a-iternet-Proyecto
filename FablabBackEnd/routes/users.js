const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario, obtenerPerfil,actualizarPerfil,cambiarPassword,forgotPassword,resetPassword} = require('../controllers/userController');
const { verificarToken } = require('../middleware/authMiddleware');

// Registro
router.post('/register', registrarUsuario);

// Login
router.post('/login', loginUsuario);

// Perfil 
router.get('/perfil', verificarToken, obtenerPerfil);

//Metodo para editar el perfil
router.put('/perfil', verificarToken, actualizarPerfil);

//Metodo para editar la contraseña del perfil
router.put("/cambiar-password", verificarToken, cambiarPassword);

//Para Resetar Contraseñas
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
