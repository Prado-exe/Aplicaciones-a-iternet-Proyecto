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
  },
  IDR_Inscritos: {
    type: [Number], // ids de usuarios inscritos (o RUTs)
    default: [],
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

module.exports = mongoose.model("Evento", EventoSchema);
