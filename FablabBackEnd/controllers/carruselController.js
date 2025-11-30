const ConfiguracionGeneral = require("../models/ConfiguracionGeneral");
const Evento = require("../models/Evento");

// Obtener datos del carrusel
exports.getCarruselData = async (req, res) => {
  try {
    // Buscamos el único documento de configuración general
    const configGeneral = await ConfiguracionGeneral.findById("config_general");

    if (!configGeneral) {
      return res.json({
        eventos: [],
        config: { cantidadMostrar: 0 }
      });
    }

    // Accedemos a la subestructura de carrusel
    const eventos = await Evento.find({
      _id: { $in: configGeneral.carrusel.eventos_mostrados }
    });

    res.json({ eventos, config: configGeneral.carrusel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Guardar nueva configuración del carrusel
exports.updateCarruselConfig = async (req, res) => {
  const { eventos_mostrados, cantidadMostrar } = req.body;

  try {
    const configGeneral = await ConfiguracionGeneral.findByIdAndUpdate(
      "config_general",
      {
        $set: {
          "carrusel.eventos_mostrados": eventos_mostrados,
          "carrusel.cantidadMostrar": cantidadMostrar
        }
      },
      { upsert: true, new: true } // crea si no existe
    );

    res.json({ message: "Configuración del carrusel actualizada", config: configGeneral.carrusel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
