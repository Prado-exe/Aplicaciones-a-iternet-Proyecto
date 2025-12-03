const mongoose = require("mongoose");

const ConfiguracionGeneralSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: "config_general", // siempre habrá un solo documento
  },

  carrusel: {
    eventos_mostrados: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Evento",
      }
    ],
    cantidadMostrar: {
      type: Number,
      default: 3,
    },
  },

  eventos: {
    eventos_mostrados: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Evento",
      }
    ],
    cantidadMostrar: {
      type: Number,
      default: 3,
    },
  },

  talleres: {
    talleres_mostrados: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Evento",
      }
    ],
    cantidadMostrar: {
      type: Number,
      default: 3,
    },
  },
});

module.exports = mongoose.model("ConfiguracionGeneral", ConfiguracionGeneralSchema);
