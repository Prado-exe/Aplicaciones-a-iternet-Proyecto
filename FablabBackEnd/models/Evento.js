const mongoose = require("mongoose");

const ActividadSchema = new mongoose.Schema({
  TituloActividad: {
    type: String,
    required: true,
  },
  DescripcionActividad: {
    type: String,
    required: true,
  }
});

const CuposSchema = new mongoose.Schema({
  CantidadCupos: {
    type: Number,
    required: true,
    min: 1
  },
  IDR_Inscritos: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Usuario",
    default: []
  },
  CuposDisponibles: {
    type: Number,
    default: 0
  }
});


const EventoSchema = new mongoose.Schema({
  NombreEvento: {
    type: String,
    required: true
  },
  TipoEvento: {
    type: Number,
    required: true,
    enum: [1, 2, 3] // si tu sistema solo usa estos 3
  },
  FechaEvento: {
    type: Date,
    required: true
  },
  DescripcionEvento: {
    type: String,
    required: true
  },
  RutaImagenEvento: {
    type: String,
    required: false
  },

  CuposEventos: {
    type: CuposSchema,
    required: true
  },

  Actividades: {
    type: [ActividadSchema],
    default: []
  }
});

EventoSchema.pre("save", function (next) {
  const inscritos = this.CuposEventos.IDR_Inscritos.length;
  const total = this.CuposEventos.CantidadCupos;

  this.CuposEventos.CuposDisponibles = Math.max(total - inscritos, 0);

  next();
});

module.exports = mongoose.model("Evento", EventoSchema);
