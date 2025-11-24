const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const userSchema = new mongoose.Schema({
  TipoUsuario: { 
    type: Number,
    enum: [1, 2], //
    default: 2,  
    required: [true, 'El tipo de usuario es requerido'],
  },
  
  Nickname: {
    type: String,
    required: [true, 'El Nickname de usuario es requerido'],
    trim: true,
    unique: true,     
    minlength: [3, 'El Nickname debe tener al menos 3 caracteres'],
    maxlength: 30,
  },

  NombreUsuario: {
    type: String,
    required: [true, 'El nombre de usuario es requerido'],
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: 100,
  },

  CorreoUsuario: {
    type: String,
    required: [true, 'El correo es requerido'],
    unique: true,     
    lowercase: true,
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Debe ingresar un correo válido'],
  },

  ContraUsuario: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
    select: false,
  },

  // Referencias a otras colecciones
  Actividades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actividad' }],
  Solicitudes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Solicitud' }],
  Proyectos:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto' }],

  FechaUltimaSesion: { 
    type: Date,
  },

  FechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

// Hash antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('ContraUsuario')) return next();
  const salt = await bcrypt.genSalt(10);
  this.ContraUsuario = await bcrypt.hash(this.ContraUsuario, salt);
  next();
});

module.exports = mongoose.model('Usuario', userSchema, 'Usuarios');
