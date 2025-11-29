// models/configuracionTalleres.js
const mongoose = require("mongoose");

const ConfiguracionTalleresSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: "config_talleres", // solo habrá un documento de configuración
  },

  talleres_mostrados: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evento" // 👈 referencia al modelo que ya tienes
    }
  ],

  cantidadMostrar: {
    type: Number,
    default: 3
  }
});

module.exports = mongoose.model("ConfiguracionTalleres", ConfiguracionTalleresSchema);
