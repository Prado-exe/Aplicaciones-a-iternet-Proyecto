const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
connectDB();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5173/"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // permite curl, Postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } 
    console.error("CORS blocked:", origin);
    return callback(new Error("CORS origin no permitido"));
  },
  credentials: true
}));

app.use((req, res, next) => {
  console.log("Incoming origin:", req.headers.origin);
  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/eventos", require("./routes/EventoRoutes"));
app.use("/api/users", require("./routes/users.js"));

//esta ruta es ultra experimental para el carrusel, espero no explote xd
app.use("/api/carrusel", require("./routes/carruselRoutes"));
app.use('/api/talleres', require("./routes/talleresRoute"));
app.use('/api/eventos', require("./routes/EventosRoutes"));


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

// Para las solicitudes generales
const solicitudRoutes = require('./routes/solicitudes');
app.use('/api/solicitudes', solicitudRoutes);

// Para las configuraciones/funciones específicas
const solicitudesAdminRoutes = require("./routes/solicitudesRoutes");
app.use("/api/solicitudes/admin", solicitudesAdminRoutes);

const adminParticipantesRoutes = require("./routes/adminParticipantesRoutes");
app.use("/api/admin/participantes", adminParticipantesRoutes);



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