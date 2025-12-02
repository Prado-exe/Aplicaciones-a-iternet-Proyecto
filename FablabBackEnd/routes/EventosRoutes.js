// routes/eventos.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/eventosController");

// Obtener configuración + eventos destacados
router.get("/config", controller.getEventosData);

// Actualizar configuración de eventos
router.put("/config", controller.updateEventosConfig);

// Traer todos los eventos para el admin
router.get("/", controller.getAllEventos);

module.exports = router;
