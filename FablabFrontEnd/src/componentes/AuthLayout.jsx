import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import fablabTest from "../assets/fablab_test.png";
import fab1 from "../assets/fablab_test.png";
import fab2 from "../assets/ImagenVision.png";
import fab3 from "../assets/Robotica.jpg";

export default function AuthLayout({ title, children }) {
  const images = [fab1, fab2, fab3];
  const [current, setCurrent] = useState(0);
  const [isRegister, setIsRegister] = useState(false);
  const [flash, setFlash] = useState(false); // 🔹 estado del brillo temporal

  // Detecta si es el formulario de registro
  useEffect(() => {
    setIsRegister(title?.toLowerCase().includes("crear"));
  }, [title]);

  // Carrusel de imágenes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Variantes compartidas para animación suave desde abajo
  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -40, transition: { duration: 0.3, ease: "easeIn" } },
  };

  // 🔹 Escucha clics en los botones para activar flash del título
  useEffect(() => {
    const handleFlash = (e) => {
      if (e.target.tagName === "BUTTON") {
        setFlash(true);
        setTimeout(() => setFlash(false), 700);
      }
    };
    window.addEventListener("click", handleFlash);
    return () => window.removeEventListener("click", handleFlash);
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden text-white">
      {/* 🔹 Fondo fijo con blur y oscurecido */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-lg brightness-75"
        style={{ backgroundImage: `url(${fablabTest})` }}
      ></div>

      {/* 🔹 Card principal fija (altura dinámica según login/registro) */}
      <motion.div
        layout
        animate={{
          height: isRegister ? 560 : 480,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative z-10 flex w-[950px] rounded-2xl overflow-hidden shadow-2xl bg-black/50 backdrop-blur-md border border-gray-700/40"
      >
        {/* Panel izquierdo - formulario */}
        <div className="flex-1 flex flex-col justify-center items-center p-10">
          {/* 🔹 Título animado con entrada desde abajo y resplandor controlado */}
          <motion.h2
            key={title}
            variants={fadeUp}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-bold mb-6 text-yellow-400 drop-shadow-md text-center"
            style={{
              textShadow: flash
                ? "0 0 6px #facc15, 0 0 12px #facc15, 0 0 20px #facc15"
                : "0 0 3px #facc15, 0 0 6px #facc15",
            }}
          >
            {title}
          </motion.h2>

          {/* 🔹 Contenido del formulario (children) */}
          <motion.div
            key={`${title}-content`}
            variants={fadeUp}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
            className="w-full flex flex-col items-center"
          >
            {children}
          </motion.div>
        </div>

        {/* Panel derecho - carrusel fijo */}
        <div className="flex-1 relative">
          <motion.img
            key={current}
            src={images[current]}
            alt="Fablab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
}
