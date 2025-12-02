const express = require("express");
const router = express.Router();
const controller = require("../controllers/talleresController");

// obtener config + talleres
router.get("/config", controller.getTalleresData);

// actualizar config de talleres
router.put("/config", controller.updateTalleresConfig);

module.exports = router;
