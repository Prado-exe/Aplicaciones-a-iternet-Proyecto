//Este modelo es unicamente para validar las reservas de los servicios
const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema({
  // Usuario que hace la solicitud / reserva
  IDR_Usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El usuario de la solicitud es requerido'],
  },

  TipoSolicitud: {
    type: String,
    required: [true, 'El tipo de solicitud es requerido'],
    trim: true,
    enum: {
      values: ['Impresora 3D', 'Corte Laser', 'Realidad Virtual'],
    },
  },

  DescripcionSolicitud: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no debe superar los 500 caracteres'],
  },

  // true = aceptada, false = pendiente
  EstadoSolicitud: {
    type: Boolean,
    default: false,
  },

  FechaReserva: { //Esta fecha representa la creacion del documento (de momento)
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Solicitud', solicitudSchema, 'Solicitudes');
