import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles/index.css';
import App from './App.jsx'
import PagQuienesSomos from './componentes/PagQuienesSomos.jsx';
import PagServicios from './componentes/PagServicios.jsx';
import PagNoticiero from './componentes/PagNoticiero.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<App />} />
        {/* Página "Sobre Nosotros" */}
        <Route path="/pag-quienes-somos" element={<PagQuienesSomos />} />
        {/* Página "Servicios" */}
        <Route path="/pag-servicios" element={<PagServicios />} /> 
        {/* Página "Noticias" */}
        <Route path="/pag-Noticiero" element={<PagNoticiero />} /> 

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

