//al igual qu7e el esquema, esta mmda es para testeo, ya que no se me ocurre una forma realmente correcta de guardar la config persistente sin depender de un lugar especifico
//y que a su vez sea actualizable de manera mas dinamica, un .json en los elementos del proyecto no es carta pq no tiene dinamismo (o sea si pero no)
const ConfiguracionCarrusel = require("../models/ConfiguracionCarrusel");
const Evento = require("../models/Evento");

// Obtener configuración + eventos asociados
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
