const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario, obtenerPerfil,actualizarPerfil,cambiarPassword} = require('../controllers/userController');
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


module.exports = router;
