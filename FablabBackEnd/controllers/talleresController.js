const ConfiguracionGeneral = require("../models/ConfiguracionGeneral");
const Evento = require("../models/Evento"); // usamos Evento como modelo

// Obtener configuración + eventos asociados (talleres)
exports.getTalleresData = async (req, res) => {
  try {
    const configGeneral = await ConfiguracionGeneral.findById("config_general");

    if (!configGeneral) {
      return res.json({
        talleres: [],
        config: { cantidadMostrar: 0 }
      });
    }

    const talleres = await Evento.find({
      _id: { $in: configGeneral.talleres.talleres_mostrados }
    });

    res.json({ talleres, config: configGeneral.talleres });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Guardar nueva configuración de talleres
exports.updateTalleresConfig = async (req, res) => {
  const { talleres_mostrados, cantidadMostrar } = req.body;

  try {
    const configGeneral = await ConfiguracionGeneral.findByIdAndUpdate(
      "config_general",
      {
        $set: {
          "talleres.talleres_mostrados": talleres_mostrados,
          "talleres.cantidadMostrar": cantidadMostrar
        }
      },
      { upsert: true, new: true } // crea si no existe
    );

    res.json({ message: "Configuración de talleres actualizada", config: configGeneral.talleres });
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
