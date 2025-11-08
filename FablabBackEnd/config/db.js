const mongoose = require('mongoose');

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log('Mongo conectado:', conn.connection.host);
    console.log('Base de datos activa:', conn.connection.name);
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
