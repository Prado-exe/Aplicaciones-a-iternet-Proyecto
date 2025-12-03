const solicitudService = require("../services/solicitud.service");

exports.crearSolicitudConProyectoExistente = async (req, res, next) => {
  try {
    const data = await solicitudService.crearSolicitudConProyectoExistente(
      req.user.id,   // userId
      req.body,      // campos de texto
      req.files      // imagenFiles / archivoFiles
    );

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.crearSolicitudYProyectoNuevo = async (req, res, next) => {
  try {
    const data = await solicitudService.crearSolicitudYProyectoNuevo(
      req.user.id,
      req.body,
      req.files
    );

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
