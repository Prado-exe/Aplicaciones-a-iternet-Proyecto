const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
    
  IDR_Usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El autor del proyecto es requerido'],
  },

  IDR_Solicitudes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Solicitud', 
    },
  ],
  
  NombreProyecto: {
    type: String,
    required: [true, 'El nombre del proyecto es requerido'],
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [30, 'El nombre no debe superar los 150 caracteres'],
  },

  DescripcionProyecto: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no debe superar los 1000 caracteres'],
  },

  imagenes: [
    {
      _id: false,
      url: { type: String },
      publicId: { type: String },
    },
  ],

  archivos: [
  {
    _id: false,
    url: { type: String, required: true },
    publicId: { type: String },
    mimeType: { type: String },
    originalName: { type: String },
  },
  ],

  FechaCreacion: {
    type: Date,
    default: Date.now,
  },


});


module.exports = mongoose.model('Proyecto', proyectoSchema, 'Proyectos');
