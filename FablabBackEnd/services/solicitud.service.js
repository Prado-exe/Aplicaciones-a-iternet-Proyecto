const Solicitud = require("../models/Solicitudes");
const Proyecto = require("../models/Proyecto");
const proyectoService = require("./proyectos.service");
const Usuario = require("../models/User");

//Limite de archivos/imagenes por proyectos
const MAX_IMAGES = 3;
const MAX_FILES = 2;

//Funcion para mapear y separar achivos e imagenes
function mapFiles(files = {}) {
  let imagenes = [];
  let archivos = [];

  if (Array.isArray(files.imagenFiles) && files.imagenFiles.length > 0) {
    imagenes = files.imagenFiles.map((file) => ({
      url: file.path,
      publicId: file.filename || file.public_id || null,
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
  return { imagenes, archivos };
}

// Funcion para validar que no se pasen los límites por proyecto en caso de que por alguna razon haya paso del frontend
function validarLimitesProyecto(proyecto, nuevasImagenes = [], nuevosArchivos = []) {
  const currentImgCount = Array.isArray(proyecto.imagenes)
    ? proyecto.imagenes.length
    : 0;

  const currentFileCount = Array.isArray(proyecto.archivos)
    ? proyecto.archivos.length
    : 0;

  const incomingImgCount = Array.isArray(nuevasImagenes)
    ? nuevasImagenes.length
    : 0;

  const incomingFileCount = Array.isArray(nuevosArchivos)
    ? nuevosArchivos.length
    : 0;

  if (currentImgCount + incomingImgCount > MAX_IMAGES) {
    const e = new Error(
      `Este proyecto ya tiene ${currentImgCount} imágenes. Solo puedes agregar ${
        MAX_IMAGES - currentImgCount
      } más.`
    );
    e.status = 400;
    throw e;
  }

  if (currentFileCount + incomingFileCount > MAX_FILES) {
    const e = new Error(
      `Este proyecto ya tiene ${currentFileCount} archivos. Solo puedes agregar ${
        MAX_FILES - currentFileCount
      } más.`
    );
    e.status = 400;
    throw e;
  }
}

//Crear solicitud y asociar a un proyecto que ya existe
exports.crearSolicitudConProyectoExistente = async (userId, body, files = {}) => {
  const { IDR_Proyecto, TipoSolicitud, DescripcionSolicitud } = body;

  //Corrobora que se eligio solicitud y que selecciono un proyecto
  if (!IDR_Proyecto || !TipoSolicitud) {
    const e = new Error("Debes indicar proyecto y tipo de solicitud");
    e.status = 400;
    throw e;
  }

  // Buscar el proyecto para asociar la solicitud
  const proyecto = await Proyecto.findOne({
    _id: IDR_Proyecto,
    IDR_Usuario: userId, 
  });

  //Verifica si lo encontro o no
  if (!proyecto) {
    const e = new Error("El proyecto no existe o no te pertenece");
    e.status = 404;
    throw e;
  }

  // Agregar imagenes/archivos nuevos al proyecto 
  const { imagenes, archivos } = mapFiles(files);
  
  //Funcion para validar cuantos imagenes/archivos puede agregar adicionalmente
  validarLimitesProyecto(proyecto, imagenes, archivos);

  //Agregar imagenes ya sea que el array este vacio o con elementos agregando simplemente
  if (imagenes.length > 0) {
    proyecto.imagenes = [...(proyecto.imagenes || []), ...imagenes];
  }

  if (archivos.length > 0) {
    proyecto.archivos = [...(proyecto.archivos || []), ...archivos];
  }

  //si es que se modifico, actualizamos el documento en bd
  if (imagenes.length > 0 || archivos.length > 0) {
    await proyecto.save();
  }

  // Crear la solicitud asociada
  const solicitud = await Solicitud.create({
    IDR_Proyecto: proyecto._id,
    TipoSolicitud,
    DescripcionSolicitud,
  });

  //Agregamos la referencia de solicitud EN proyectos
  await Proyecto.findByIdAndUpdate(proyecto._id, {
    $addToSet: { IDR_Solicitudes: solicitud._id },
  });

  //Agregar referencia de solicitud EN usuarios
  await Usuario.findByIdAndUpdate(userId, {
    $addToSet: { Solicitudes: solicitud._id },
  });

  return {
    solicitud: solicitud.toObject(),
    proyecto: proyecto.toObject(),
  };
};



//Crear solicitud y proyecto simultaneamente
exports.crearSolicitudYProyectoNuevo = async (userId, body, files = {}) => {
  const {
    TipoSolicitud,
    DescripcionSolicitud,
    NombreProyecto,        
    DescripcionProyecto,   
  } = body;

  //Corrobora que el tipo de solicitud no este vacia
  if (!TipoSolicitud) {
    const e = new Error("El tipo de solicitud es obligatorio");
    e.status = 400;
    throw e;
  }

  //Corrobora que haya dado un nombre al proyecto
  if (!NombreProyecto) {
    const e = new Error("El nombre del proyecto es obligatorio");
    e.status = 400;
    throw e;
  }

  //Empaqueta variables para reutilizar en proyectoservice
  const proyectoPayload = {
    NombreProyecto,
    DescripcionProyecto: DescripcionProyecto || "",
  };

  //llama a crear el proyecto desde la clase proyectos.service
  const nuevoProyecto = await proyectoService.createProject(
    userId,
    proyectoPayload,
    files
  );

  // Crear la solicitud asociada al nuevo proyecto
  const solicitud = await Solicitud.create({
    IDR_Proyecto: nuevoProyecto._id,
    TipoSolicitud,
    DescripcionSolicitud,
  });

  //Agregar referencia de solicitud EN proyecto
  await Proyecto.findByIdAndUpdate(nuevoProyecto._id, {
    $addToSet: { IDR_Solicitudes: solicitud._id },
  });

  //Agregar referencia de solicitud EN usuarios
  await Usuario.findByIdAndUpdate(userId, {
    $addToSet: { Solicitudes: solicitud._id },
  });

  return {
    solicitud: solicitud.toObject(),
    proyecto: nuevoProyecto.toObject(),
  };
};
