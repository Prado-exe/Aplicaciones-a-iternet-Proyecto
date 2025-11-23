const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario, obtenerPerfil,actualizarPerfil,cambiarPassword} = require('../controllers/userController');
const { verificarToken } = require('../middleware/authMiddleware');
const { verificarAdmin } = require('../middleware/adminMiddleware'); // << AÑADIDO
const { listarUsuarios } = require('../controllers/userController');

//rutas generales de usuario
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

//rutas solamente disponibles para el admin
router.get('/admin/usuarios', verificarToken, verificarAdmin, (req, res) => {
  res.json({ msg: "Solo visible para admin" });
});
router.get('/listar', verificarToken, verificarAdmin, listarUsuarios);


module.exports = router;
