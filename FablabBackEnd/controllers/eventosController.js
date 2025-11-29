// controllers/eventosController.js
const ConfiguracionEventos = require("../models/configuracionEventos");
const Evento = require("../models/Evento");

// Obtener configuración de eventos y los eventos destacados
exports.getEventosData = async (req, res) => {
  try {
    const config = await ConfiguracionEventos.findById("config_eventos");

    if (!config) {
      return res.json({
        eventos: [],
        config: { cantidadMostrar: 0 }
      });
    }

    const eventos = await Evento.find({
      _id: { $in: config.eventos_mostrados }
    });

    res.json({ eventos, config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Guardar nueva configuración de eventos
exports.updateEventosConfig = async (req, res) => {
  const { eventos_mostrados, cantidadMostrar } = req.body;

  try {
    const config = await ConfiguracionEventos.findByIdAndUpdate(
      "config_eventos",
      { eventos_mostrados, cantidadMostrar },
      { upsert: true, new: true } // crea si no existe
    );

    res.json({ message: "Configuración de eventos actualizada", config });
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
