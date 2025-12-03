const router = require("express").Router();
const {crearSolicitudConProyectoExistente,crearSolicitudYProyectoNuevo} = require("../controllers/solicitudController");
const { verificarToken } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

//Crear solicitud con proyecto ya existente
router.post("/con-proyecto",verificarToken,upload.fields([{ name: "imagenFiles", maxCount: 3 },{ name: "archivoFiles", maxCount: 2 },]),crearSolicitudConProyectoExistente);

//Crear solicitud y nuevo proyecto
router.post("/con-nuevo-proyecto",verificarToken,upload.fields([{ name: "imagenFiles", maxCount: 3 },{ name: "archivoFiles", maxCount: 2 },]),crearSolicitudYProyectoNuevo);

module.exports = router;
