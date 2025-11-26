//mas de lo mismo, rutas para la comunicacion con el carrusel en si, woa esperar feedback para ver que onda

const express = require("express");
const router = express.Router();
const controller = require("../controllers/carruselController");

// obtener config + eventos
router.get("/config", controller.getCarruselData);

// actualizar config del carrusel
router.put("/config", controller.updateCarruselConfig);

module.exports = router;
