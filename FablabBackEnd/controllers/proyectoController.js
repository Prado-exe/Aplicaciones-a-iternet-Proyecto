const proyectoService = require("../services/proyectos.service");
//Llamadas para manejar la logica de los proyectos

exports.crearProyecto = async (req, res, next) => {
  try {
    const data = await proyectoService.createProject(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
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

