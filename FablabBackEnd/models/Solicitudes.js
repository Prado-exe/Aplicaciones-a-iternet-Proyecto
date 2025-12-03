const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema({
  // Referencia al proyecto
  IDR_Proyecto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proyecto',
    required: [true, 'El proyecto asociado es requerido'],
  },

  TipoSolicitud: {
    type: String,
    required: [true, 'El tipo de solicitud es requerido'],
    trim: true,
    enum: ['Corte y grabado Laser', 'Impresora 3D', 'Electrónica y Robótica','Realidad Virtual','Realidad Aumentada'],
  },

  DescripcionSolicitud: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripcion no debe superar los 500 caracteres'],
  },

  EstadoSolicitud: {
    type: Boolean,
    default: false,
  },

  FechaReserva: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Solicitud', solicitudSchema, 'Solicitudes');