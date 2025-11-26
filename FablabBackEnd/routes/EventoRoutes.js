const express = require("express");
const router = express.Router();
const { crearEvento, getAllEventos } = require("../controllers/eventoController");
const { verificarToken } = require("../middleware/authMiddleware");
module.exports = router;


// Solo administradores
router.post("/crear", verificarToken, (req, res, next) => {
  if (req.user.tipo !== 1) {  // ejemplo: tipo 1 = admin
    return res.status(403).json({ error: "No autorizado" });
  }
  next();
}, crearEvento);

// Ruta pública para obtener todos los eventos
router.get("/", getAllEventos);

