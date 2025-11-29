const ConfiguracionCarrusel = require("../models/ConfiguracionCarrusel");
const Evento = require("../models/Evento");

exports.getCarruselData = async (req, res) => {
  try {
    const config = await ConfiguracionCarrusel.findById("config_carrusel");

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

// Guardar nueva configuración
exports.updateCarruselConfig = async (req, res) => {
  const { eventos_mostrados, cantidadMostrar } = req.body;

  try {
    const config = await ConfiguracionCarrusel.findByIdAndUpdate(
      "config_carrusel",
      { eventos_mostrados, cantidadMostrar },
      { upsert: true, new: true } // crea si no existe
    );

    res.json({ message: "Configuración actualizada", config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
