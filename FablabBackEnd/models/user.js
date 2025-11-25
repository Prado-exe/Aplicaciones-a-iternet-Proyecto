const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const userSchema = new mongoose.Schema({
  ID_Usuario: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(), //Usuario Unico 
  },
  TipoUsuario: { // 0: Básico, 1: Admin
    type: Number,
    default: 0,
  },
  NombreUsuario: {
    type: String,
    trim: true, //Normalizar entradas (espacios)
  },
  CorreoUsuario: {
    type: String,
    required: [true, 'El correo es requerido'],
    unique: true,//Correo unico
    lowercase: true, //Transformar a miniscula el campo
    trim: true, //Normalizar entradas (espacios)
  },
  ContraUsuario: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    select: false,
  },
  //Referencias a otras Colecciones
  Actividades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actividad' }],
  Solicitudes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Solicitud' }],
  Proyectos:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto' }],

  FechaUltimaSesion: { type: Date, default: null },
  FechaCreacion: {
    type: String,
    default: () => new Date().toLocaleDateString('es-CL'),
  },
});

// Hash antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('ContraUsuario')) return next();
  const salt = await bcrypt.genSalt(10);
  this.ContraUsuario = await bcrypt.hash(this.ContraUsuario, salt);
  next();
});

module.exports = mongoose.model('usuario', userSchema); //Nombre del modelo/Collecion de la bd
