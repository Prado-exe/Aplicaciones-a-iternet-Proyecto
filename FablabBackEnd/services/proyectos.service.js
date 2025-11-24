const Proyecto = require("../models/Proyecto");
const Usuario = require("../models/User");

//Crear proyectos
exports.createProject = async (userId, body) => {
  const { NombreProyecto, DescripcionProyecto} = body;

  //Verificar que tenga nombre el proyecto
  if (!NombreProyecto) {
    const e = new Error("Falta el nombre del proyecto");
    e.status = 400;
    throw e;
  }

  const doc = await Proyecto.create({
    IDR_Usuario: userId,
    NombreProyecto,
    DescripcionProyecto,
  });

  //Actualizar Array proyectos en Usuario
  await Usuario.findByIdAndUpdate(
    userId,
    {
      $push: {
        Proyectos: doc._id,
      },
    },
    { new: true }
  );

  return doc.toObject();
};

//Para devolver la lista de proyectos del usuario
exports.getMyProjects = async (userId) => {
  return await Proyecto.find({ IDR_Usuario: userId })
    .sort({ FechaCreacion: -1 })
    .lean();
};

//Eliminar un proyecto en especifico
exports.deleteProject = async (userId, projectId) => {
  const deleted = await Proyecto.findOneAndDelete({
    _id: projectId,
    IDR_Usuario: userId,
  }).lean();

  if (!deleted) {
    const e = new Error("Proyecto no encontrado o no autorizado");
    e.status = 404;
    throw e;
  }


  // Quitar referencia del array en el usuario
  await Usuario.findByIdAndUpdate(
    userId,
    { $pull: { Proyectos: projectId } } // otra vez, ajustar nombre del campo
  );

  return deleted;
};

//-----------------FUNCIONES ADICIONALES EN CASO DE NECESITARLAS------------------------//

//Retorna un proyecto y su informacion
exports.getProjectById = async (userId, projectId) => {
  const proj = await Proyecto.findOne({
    _id: projectId,
    IDR_Usuario: userId,
  }).lean();

  if (!proj) {
    const e = new Error("Proyecto no encontrado");
    e.status = 404;
    throw e;
  }
  return proj;
};

//Actualizar la informacion de un proyecto
exports.updateProject = async (userId, projectId, body) => {
  const proj = await Proyecto.findOneAndUpdate(
    { _id: projectId, IDR_Usuario: userId },
    body,
    { new: true, runValidators: true }
  ).lean();

  if (!proj) {
    const e = new Error("Proyecto no encontrado o no autorizado");
    e.status = 404;
    throw e;
  }
  return proj;
};

