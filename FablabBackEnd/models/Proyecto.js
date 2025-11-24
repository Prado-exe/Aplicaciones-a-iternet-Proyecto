const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
    
  IDR_Usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El autor del proyecto es requerido'],
  },

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

  RutaImagenProyecto: {
    type: String,
    trim: true,
    default: "https://...",
  },

  // Componentes del proyecto (lista de materiales, partes, etc.)
  Componentes: [
    {
        IDR_Componente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inventario',
        },
        Cantidad: {
            type: Number,
            min: [1, 'La cantidad mínima es 1'],
            default: 1,
      },
    },
  ],

  FechaCreacion: {
    type: Date,
    default: Date.now,
  },

});


module.exports = mongoose.model('Proyecto', proyectoSchema, 'Proyectos');
