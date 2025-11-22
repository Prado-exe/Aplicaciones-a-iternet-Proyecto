const router = require("express").Router();
const {crearProyecto,listarMisProyectos,obtenerProyecto,actualizarProyecto} = require("../controllers/proyectoController");
const { verificarToken } = require("../middleware/authMiddleware");

//Registro proyecto
router.post("/", verificarToken, crearProyecto);

//Obtener todos los proyectos(Lista)
router.get("/mios", verificarToken, listarMisProyectos);

//Obtener informacion de un proyecto
router.get("/:id", verificarToken, obtenerProyecto);

//Actualizar un proyecto
router.put("/:id", verificarToken, actualizarProyecto);

module.exports = router;
