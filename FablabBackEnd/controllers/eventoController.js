// eventoController.js
const Evento = require("../models/Evento");

exports.crearEvento = async (req, res) => {
  try {
    const nuevoEvento = new Evento(req.body);
    await nuevoEvento.save();

    return res.status(201).json({
      mensaje: "Evento creado con éxito",
      evento: nuevoEvento
    });

  } catch (error) {
    console.error("Error al crear evento:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
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
