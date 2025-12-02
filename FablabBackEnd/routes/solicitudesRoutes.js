const express = require("express");
const router = express.Router();
const solicitudesController = require("../controllers/SolicitudesController");

router.get("/", solicitudesController.getSolicitudes);
router.put("/:id", solicitudesController.updateSolicitud);

module.exports = router;
