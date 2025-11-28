const router = require("express").Router();
const {crearProyecto,listarMisProyectos,obtenerProyecto,actualizarProyecto,eliminarProyecto,descargarArchivoProyecto} = require("../controllers/proyectoController");
const { verificarToken } = require("../middleware/authMiddleware");
const { upload } = require('../config/cloudinary');  // 

//Registro proyecto
router.post("/", verificarToken,  upload.fields([{ name: "imagenFiles", maxCount: 3 },{ name: "archivoFiles", maxCount: 2 },]), crearProyecto);

//Obtener todos los proyectos(Lista)
router.get("/mios", verificarToken, listarMisProyectos);

//Eliminar un proyecto
/*
router.delete("/:id", verificarToken, eliminarProyecto);
*/

// Descargar archivo RAW desde Cloudinary 
router.get("/:id/archivos/:index/descargar", verificarToken, descargarArchivoProyecto);

//------------RUTAS ADICIONALES----------------//
//Obtener informacion de un proyecto
router.get("/:id", verificarToken, obtenerProyecto);

//Actualizar un proyecto
router.put("/:id", verificarToken, actualizarProyecto);

module.exports = router;
