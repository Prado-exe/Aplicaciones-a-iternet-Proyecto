// eventoController.js
const Evento = require("../models/Evento");
const Usuario = require("../models/User"); // ajusta la ruta si es distinta

exports.crearEvento = async (req, res) => {
  try {
    //campos que vienen del body
    const {
      NombreEvento,
      TipoEvento,
      FechaEvento,
      DescripcionEvento,
    } = req.body;

    let CuposEventos = null;
    let Actividades = [];

    if (req.body.CuposEventos) {
      try {
        CuposEventos = JSON.parse(req.body.CuposEventos);
      } catch (err) {
        console.error("Error parsing CuposEventos:", err);
      }
    }

    if (req.body.Actividades) {
      try {
        Actividades = JSON.parse(req.body.Actividades);
      } catch (err) {
        console.error("Error parsing Actividades:", err);
      }
    }

    let imagen = null;

    if (req.file) {
      imagen = {
        url: req.file.path,                     
        publicId: req.file.filename || null,    
      };
    }

    if (!CuposEventos || typeof CuposEventos.CantidadCupos !== "number") {
      return res.status(400).json({
        error: "CuposEventos es obligatorio y debe incluir CantidadCupos",
      });
    }

    const nuevoEvento = new Evento({
      NombreEvento,
      TipoEvento,
      FechaEvento,
      DescripcionEvento,
      imagen,          
      CuposEventos,      
      Actividades,       
    });

    await nuevoEvento.save();

    return res.status(201).json({
      mensaje: "Evento creado con éxito",
      evento: nuevoEvento,
    });
    
  } catch (error) {
    console.error("Error al crear evento:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};


exports.getAllEventos = async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.inscribirAEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // viene del token

    const evento = await Evento.findById(id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

    // Validar cupos
    if (evento.CuposEventos.IDR_Inscritos.includes(userId)) {
      return res.status(400).json({ error: "Ya estás inscrito" });
    }

    if (evento.CuposEventos.IDR_Inscritos.length >= evento.CuposEventos.CantidadCupos) {
      return res.status(400).json({ error: "No quedan cupos disponibles" });
    }

    evento.CuposEventos.IDR_Inscritos.push(userId);
    await evento.save();

    //agregar el id evento al array de actividades en Usuario
    await Usuario.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          Actividades: evento._id, //id
        },
      },
      { new: true }
    );

    // 🔹 Devuelve el evento actualizado
    res.json(evento);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al inscribirse" });
  }
};


