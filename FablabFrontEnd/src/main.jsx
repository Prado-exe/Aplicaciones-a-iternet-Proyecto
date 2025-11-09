import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import './styles/index.css';
import App from './App.jsx';
import PagQuienesSomos from './componentes/PagQuienesSomos.jsx';
import PagServicios from './componentes/PagServicios.jsx';
import PagNoticiero from './componentes/PagNoticiero.jsx';
import AuthPage from './componentes/AuthPage.jsx';

// 🔹 Envolvemos tus rutas en un componente animado
function AnimatedRoutes() {
  const location = useLocation();

  // Transición más fluida y sin “temblores”
  const pageTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4, ease: "easeOut" }
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div {...pageTransition}>
              <App />
            </motion.div>
          }
        />
        <Route
          path="/pag-quienes-somos"
          element={
            <motion.div {...pageTransition}>
              <PagQuienesSomos />
            </motion.div>
          }
        />
        <Route
          path="/pag-servicios"
          element={
            <motion.div {...pageTransition}>
              <PagServicios />
            </motion.div>
          }
        />
        <Route
          path="/pag-Noticiero"
          element={
            <motion.div {...pageTransition}>
              <PagNoticiero />
            </motion.div>
          }
        />
        <Route
          path="/auth"
          element={
            <motion.div {...pageTransition}>
              <AuthPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

// 🔹 Envolvemos todo con BrowserRouter
function Root() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
