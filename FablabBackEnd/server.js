const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
connectDB();

// Middleware
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:5173"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/eventos", require("./routes/EventoRoutes"));
app.use("/api/users", require("./routes/users.js"));

//esta ruta es ultra experimental para el carrusel, espero no explote xd
app.use("/api/carrusel", require("./routes/carruselRoutes"));

//ruas de testeo para ver si se consulta bien la bd

// Rutas de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 API Fablab funcionando correctamente',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Ruta de prueba funcionando',
    data: { 
      backend: 'MERN Stack',
      test: true 
    }
  });
});

// ------------------Importar rutas-----------------------//

//Ruta de usuario
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

//Ruta de proyectos
const proyectoRoutes = require('./routes/proyectos');
app.use('/api/proyectos', proyectoRoutes);


// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path 
  });
});

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error("Error capturado:", err);

  const status = err.status || 500;

  res.status(status).json({
    ok: false,
    message: err.message || 'Error interno del servidor',
    errors: err.errors || null,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 Acepta peticiones de http://localhost:5173`);
  console.log(`⏰ ${new Date().toLocaleString()}`);
  console.log('=================================');
});