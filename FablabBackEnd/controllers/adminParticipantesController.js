const Evento = require("../models/Evento");

// 📌 Obtener todos los eventos con sus participantes (inscritos)
exports.getEventosConParticipantes = async (req, res) => {
  try {
    const eventos = await Evento.find()
      .populate("CuposEventos.IDR_Inscritos", "Nickname NombreUsuario CorreoUsuario")
      .sort({ FechaEvento: 1 });

    return res.json(eventos);

  } catch (error) {
    console.error("Error al obtener eventos con participantes:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 📌 Obtener eventos futuros / en curso
exports.getEventosEnCurso = async (req, res) => {
  try {
    const ahora = new Date();

    const eventos = await Evento.find({
      FechaEvento: { $gte: ahora }
    })
      .populate("CuposEventos.IDR_Inscritos", "Nickname NombreUsuario CorreoUsuario")
      .sort({ FechaEvento: 1 });

    return res.json(eventos);

  } catch (error) {
    console.error("Error al obtener eventos en curso:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 📌 Obtener eventos pasados
exports.getEventosPasados = async (req, res) => {
  try {
    const ahora = new Date();

    const eventos = await Evento.find({
      FechaEvento: { $lt: ahora }
    })
      .populate("CuposEventos.IDR_Inscritos", "Nickname NombreUsuario CorreoUsuario")
      .sort({ FechaEvento: -1 });

    // Siempre devolver un array
    return res.json(Array.isArray(eventos) ? eventos : []);

  } catch (error) {
    console.error("Error al obtener eventos pasados:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 📌 Obtener detalle de un evento con todos los participantes
exports.getDetalleEvento = async (req, res) => {
  try {
    const { id } = req.params;

    const evento = await Evento.findById(id)
      .populate("CuposEventos.IDR_Inscritos", "Nickname NombreUsuario CorreoUsuario FechaCreacion")
      .exec();

    if (!evento) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    return res.json(evento);

  } catch (error) {
    console.error("Error al obtener detalle del evento:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
