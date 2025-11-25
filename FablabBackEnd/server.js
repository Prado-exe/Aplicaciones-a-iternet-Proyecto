const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Importar rutas
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 Acepta peticiones de http://localhost:5174`);
  console.log(`⏰ ${new Date().toLocaleString()}`);
  console.log('=================================');
});
