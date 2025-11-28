//Llamadas para manejar la logica de los proyectos
const proyectoService = require("../services/proyectos.service");

exports.crearProyecto = async (req, res, next) => {
  try {
    const data = await proyectoService.createProject(
      req.user.id, 
      req.body, //Strings recibidos
      req.files  //Archivos recibidos
    );
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.listarMisProyectos = async (req, res, next) => {
  try {
    const data = await proyectoService.getMyProjects(req.user.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.obtenerProyecto = async (req, res, next) => {
  try {
    const data = await proyectoService.getProjectById(
      req.user.id,
      req.params.id
    );
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.actualizarProyecto = async (req, res, next) => {
  try {
    const data = await proyectoService.updateProject(
      req.user.id,
      req.params.id,
      req.body
    );
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

/*
exports.eliminarProyecto = async (req, res, next) => {
  try {
    const userId = req.user.id;      
    const proyectoId = req.params.id;
    await proyectoService.deleteProject(userId, proyectoId);

    res.json({
      success: true,
      message: "Proyecto eliminado correctamente.",
    });
  } catch (err) {
    console.error("Error al eliminar proyecto:", err);
    next(err);
  }
};
*/

exports.descargarArchivoProyecto = async (req, res, next) => {
  try {
    const data = await proyectoService.descargarArchivo(
      req.params.id,
      req.params.index
    );

    console.log("Archivo encontrado:", data.originalName);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(data.originalName)}"`
    );
    res.setHeader("Content-Type", data.mimeType);
    res.send(data.buffer);

  } catch (err) {
    console.error("Error capturado:", err);
    res.status(500).json({ error: "Error al descargar archivo" });
  }
};