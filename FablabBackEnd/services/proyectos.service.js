const Proyecto = require("../models/Proyecto");
const Usuario = require("../models/User");
const { cloudinary } = require("../config/cloudinary"); 

//Crear proyectos
exports.createProject = async (userId, body, files = {}) => {
  let imagenes = [];
  let archivos = [];

  // imagenes
  if (Array.isArray(files.imagenFiles) && files.imagenFiles.length > 0) {
    imagenes = files.imagenFiles.map((file) => ({
      url: file.path,                                   
      publicId: file.filename || file.public_id || null 
    }));
  }

  if (Array.isArray(files.archivoFiles) && files.archivoFiles.length > 0) {
    archivos = files.archivoFiles.map((file) => ({
      url: file.path,
      publicId: file.filename || file.public_id || null,
      mimeType: file.mimetype,
      originalName: file.originalname,
    }));
  }

  // Construir el documento a guardar
  const proyecto = new Proyecto({
    IDR_Usuario: userId,
    NombreProyecto: body.NombreProyecto,
    DescripcionProyecto: body.DescripcionProyecto || "",
    imagenes,
    archivos,
  });

  //Inserta el documento
  const saved = await proyecto.save();

  // asociar proyecto al usuario
  await Usuario.findByIdAndUpdate(userId, {
    $addToSet: { Proyectos: saved._id },
  });

  //Retorna el documento para la respuesta http y ademas contruir el entries del ui
  return saved;
};



//Para devolver la lista de proyectos del usuario
exports.getMyProjects = async (userId) => {
  return await Proyecto.find({ IDR_Usuario: userId })
    .sort({ FechaCreacion: -1 })
    .lean();
};

//Eliminar un proyecto en especifico
/*
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


  //Eliminar imagenes de cloudinary
  if (Array.isArray(deleted.imagenes) && deleted.imagenes.length > 0) {
    const destroyPromises = deleted.imagenes
      .filter((img) => img && img.publicId)
      .map((img) =>
        cloudinary.uploader.destroy(img.publicId).catch((err) => {
          console.error(
            "Error borrando imagen en Cloudinary:",
            img.publicId,
            err
          );
        })
      );

    await Promise.all(destroyPromises);
  }

  // Quitar referencia del array en el usuario
  await Usuario.findByIdAndUpdate(
    userId,
    { $pull: { Proyectos: projectId } } // otra vez, ajustar nombre del campo
  );

  return deleted;
};
*/

exports.descargarArchivo = async (projectId, index) => {
  const proyecto = await Proyecto.findById(projectId);
  if (!proyecto) {
    throw { status: 404, message: "Proyecto no encontrado" };
  }

  const archivo = proyecto.archivos?.[index];
  if (!archivo) {
    throw { status: 404, message: "Archivo no encontrado" };
  }

  const response = await fetch(archivo.url); //Consulta en clodinary
  if (!response.ok) {
    throw { status: 500, message: "No se pudo obtener el archivo desde Cloudinary" };
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return {
    originalName: archivo.originalName || "archivo", //obtiene de BD
    mimeType: archivo.mimeType || "application/octet-stream", //obtiene de bd
    buffer, //obtiene de cloudinary
  };
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

