const express = require("express");
const router = express.Router();
const controller = require("../controllers/carruselController");

// obtener config + eventos
router.get("/config", controller.getCarruselData);

// actualizar config del carrusel
router.put("/config", controller.updateCarruselConfig);

module.exports = router;
