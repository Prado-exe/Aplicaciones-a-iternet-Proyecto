import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./styles/index.css";
import { AuthProvider } from "./context/AuthContext.jsx";

// 🔹 Páginas y componentes globales
import Navbar from "./componentes/Navbar.jsx";
import Footer from "./componentes/footbar.jsx";
import BtnVolverInicio from "./componentes/BtnVolverInicio.jsx";
import App from "./App.jsx";
import PagQuienesSomos from "./componentes/PagQuienesSomos.jsx";
import PagServicios from "./componentes/PagServicios.jsx";
import PagNoticiero from "./componentes/PagNoticiero.jsx";
import AuthPage from "./componentes/AuthPage.jsx";
import PagMiCuenta from "./componentes/PagMiCuenta.jsx";
import PagMisProyectos from "./componentes/PagMisProyectos.jsx";
import PagAdmin from "./componentes/PagAdmin.jsx";
import ResetPassword from "./componentes/ResetPassword";


//estas componentes las cree para probar las rutas de admin 
import AdminRoute from "./componentes/AdminRoute";
import PagNoAutorizado from "./componentes/PagNoAutorizado.jsx";


// 🔹 Componente que fuerza el scroll al inicio en cada cambio de ruta
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // si prefieres sin animación, cambia a "auto"
    });
  }, [pathname]);

  return null;
}

// 🔸 Componente para las transiciones entre páginas
function AnimatedRoutes() {
  const location = useLocation();

  const pageTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4, ease: "easeOut" },
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
          path="/pag-noticiero"
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
        <Route //ResetPassword prototipo
          path="/reset-password"
          element={
            <motion.div {...pageTransition}>
              <ResetPassword />
            </motion.div>
          }
        />
        <Route
          path="/mi-cuenta"
          element={
            <motion.div {...pageTransition}>
              <PagMiCuenta />
            </motion.div>
          }
        />
        <Route
          path="/mis-proyectos"
          element={
            <motion.div {...pageTransition}>
              <PagMisProyectos />
            </motion.div>
          }
        />
        <Route
          path="/admin"
          element={
            <motion.div {...pageTransition}>
              <AdminRoute>
                <PagAdmin />
              </AdminRoute>
            </motion.div>
          }
        />
        <Route
          path="/no-autorizado"
          element={
            <motion.div {...pageTransition}>
              <PagNoAutorizado />
            </motion.div>
          }
        />

      </Routes>
    </AnimatePresence>
  );
}

// 🔹 Componente raíz con Navbar y Footer globales
function Root() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        {/* Scroll al inicio */}
        <ScrollToTop />

        {/* Rutas con animación */}
        <AnimatedRoutes />

        {/* Componentes fijos */}
        <BtnVolverInicio />

        {/* Footer global si lo usan */}
        {/* <Footer /> */}
      </AuthProvider>
    </BrowserRouter>
  );
}

// 🔹 Render final
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
