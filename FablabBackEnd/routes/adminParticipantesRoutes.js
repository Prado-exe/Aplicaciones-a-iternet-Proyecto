const express = require("express");
const router = express.Router();
const adminParticipantesController = require("../controllers/adminParticipantesController");

// Obtener todos los eventos con participantes
router.get("/", adminParticipantesController.getEventosConParticipantes);

// Obtener solo eventos en curso
router.get("/encurso", adminParticipantesController.getEventosEnCurso);

// Obtener detalle de un evento
router.get("/:id", adminParticipantesController.getDetalleEvento);

module.exports = router;

