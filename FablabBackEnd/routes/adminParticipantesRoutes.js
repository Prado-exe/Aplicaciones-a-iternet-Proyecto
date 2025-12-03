const express = require("express");
const router = express.Router();
const adminParticipantesController = require("../controllers/adminParticipantesController");

// Obtener todos los eventos con participantes
router.get("/", adminParticipantesController.getEventosConParticipantes);

// Obtener solo eventos en curso
router.get("/encurso", adminParticipantesController.getEventosEnCurso);

// ⭐ RUTA FALTANTE PARA EVENTOS PASADOS ⭐
router.get("/pasados", adminParticipantesController.getEventosPasados); 

// Obtener detalle de un evento (Debe ir al final para no interferir con /encurso y /pasados)
router.get("/:id", adminParticipantesController.getDetalleEvento);

module.exports = router;