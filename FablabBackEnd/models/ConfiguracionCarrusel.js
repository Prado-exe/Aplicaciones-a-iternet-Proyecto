//este modelo esta diseñado namas para guardar configuraciones para el carrusel ligadas a los eventos, estoy testeando cositas  ♪♪♪♪♪
const mongoose = require("mongoose");

const ConfiguracionCarruselSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: "config_carrusel", // siempre será un solo documento
  },

  eventos_mostrados: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evento"
    }
  ],

  cantidadMostrar: {
    type: Number,
    default: 3
  }
});

module.exports = mongoose.model("ConfiguracionCarrusel", ConfiguracionCarruselSchema);
