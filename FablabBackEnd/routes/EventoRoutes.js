const express = require("express");
const router = express.Router();
const { crearEvento, getAllEventos,inscribirAEvento} = require("../controllers/eventoController");
const { verificarToken } = require("../middleware/authMiddleware");



// Solo administradores
router.post("/crear", verificarToken, (req, res, next) => {
  if (req.user.tipo !== 1) {  // ejemplo: tipo 1 = admin
    return res.status(403).json({ error: "No autorizado" });
  }
  next();
}, crearEvento);

// Ruta pública para obtener todos los eventos
router.get("/", getAllEventos);
router.post("/:id/inscribir", verificarToken, inscribirAEvento);

module.exports = router;