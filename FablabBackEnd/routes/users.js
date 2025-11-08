const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario, obtenerPerfil } = require('../controllers/userController');
const { verificarToken } = require('../middleware/authMiddleware');

// Registro
router.post('/register', registrarUsuario);

// Login
router.post('/login', loginUsuario);

// Perfil (protegido)
router.get('/perfil', verificarToken, obtenerPerfil);

module.exports = router;
