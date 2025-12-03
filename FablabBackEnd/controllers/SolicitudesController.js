const Solicitud = require("../models/Solicitudes");
const Proyecto = require("../models/Proyecto");

// Obtener todas las solicitudes con info del proyecto
exports.getSolicitudes = async (req, res) => {
  try {
    const solicitudes = await Solicitud.find()
      .populate({
        path: "IDR_Proyecto",
        select: "NombreProyecto DescripcionProyecto FechaCreacion IDR_Usuario imagenes archivos",
        populate: {
          path: "IDR_Usuario",
          select: "nickname nombre correo", // <-- trae el nickname
        }
      })
      .sort({ FechaReserva: -1 });

    res.json(solicitudes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Actualizar estado de una solicitud
exports.updateSolicitud = async (req, res) => {
  const { id } = req.params;
  const { EstadoSolicitud } = req.body;

  try {
    const solicitud = await Solicitud.findByIdAndUpdate(
      id,
      { EstadoSolicitud },
      { new: true }
    );

    res.json({ message: "Solicitud actualizada", solicitud });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
