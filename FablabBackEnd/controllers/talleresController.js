const ConfiguracionTalleres = require("../models/configuracionTalleres");
const Evento = require("../models/Evento"); // usamos Evento como modelo

// Obtener configuración + eventos asociados (talleres)
exports.getTalleresData = async (req, res) => {
  try {
    const config = await ConfiguracionTalleres.findById("config_talleres");

    if (!config) {
      return res.json({
        talleres: [],
        config: { cantidadMostrar: 0 }
      });
    }

    const talleres = await Evento.find({
      _id: { $in: config.talleres_mostrados }
    });

    res.json({ talleres, config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Guardar nueva configuración
exports.updateTalleresConfig = async (req, res) => {
  const { talleres_mostrados, cantidadMostrar } = req.body;

  try {
    const config = await ConfiguracionTalleres.findByIdAndUpdate(
      "config_talleres",
      { talleres_mostrados, cantidadMostrar },
      { upsert: true, new: true } // crea si no existe
    );

    res.json({ message: "Configuración actualizada", config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Traer todos los eventos para listarlos en el admin
exports.getAllTalleres = async (req, res) => {
  try {
    const talleres = await Evento.find(); // aquí también usamos Evento
    res.json(talleres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
