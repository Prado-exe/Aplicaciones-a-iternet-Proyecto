const ConfiguracionGeneral = require("../models/ConfiguracionGeneral");
const Evento = require("../models/Evento");
const cloudinary = require("cloudinary").v2;

// Obtener configuración de eventos y los eventos destacados
exports.getEventosData = async (req, res) => {
  try {
    const configGeneral = await ConfiguracionGeneral.findById("config_general");

    if (!configGeneral) {
      return res.json({
        eventos: [],
        config: { cantidadMostrar: 0 }
      });
    }

    const eventos = await Evento.find({
      _id: { $in: configGeneral.eventos.eventos_mostrados }
    });

    res.json({ eventos, config: configGeneral.eventos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Guardar nueva configuración de eventos
exports.updateEventosConfig = async (req, res) => {
  const { eventos_mostrados, cantidadMostrar } = req.body;

  try {
    const configGeneral = await ConfiguracionGeneral.findByIdAndUpdate(
      "config_general",
      {
        $set: {
          "eventos.eventos_mostrados": eventos_mostrados,
          "eventos.cantidadMostrar": cantidadMostrar
        }
      },
      { upsert: true, new: true } // crea si no existe
    );

    res.json({ message: "Configuración de eventos actualizada", config: configGeneral.eventos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Traer todos los eventos para listarlos en el admin
exports.getAllEventos = async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
