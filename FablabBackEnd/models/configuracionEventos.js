// models/configuracionEventos.js
const mongoose = require("mongoose");

const ConfiguracionEventosSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: "config_eventos", // solo habrá un documento de configuración
  },

  eventos_mostrados: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evento" // referencia al modelo Evento
    }
  ],

  cantidadMostrar: {
    type: Number,
    default: 3
  }
});

module.exports = mongoose.model("ConfiguracionEventos", ConfiguracionEventosSchema);
