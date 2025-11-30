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

    // 🔹 Devuelve el evento actualizado
    res.json(evento);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al inscribirse" });
  }
};


