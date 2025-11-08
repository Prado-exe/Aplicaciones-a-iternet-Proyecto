import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles/index.css';
import App from './App.jsx';
import PagQuienesSomos from './componentes/PagQuienesSomos.jsx';
import PagServicios from './componentes/PagServicios.jsx';
import PagNoticiero from './componentes/PagNoticiero.jsx';
import LoginPage from './componentes/LoginPage.jsx';
import RegisterPage from './componentes/RegisterPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/pag-quienes-somos" element={<PagQuienesSomos />} />
        <Route path="/pag-servicios" element={<PagServicios />} /> 
        <Route path="/pag-Noticiero" element={<PagNoticiero />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
