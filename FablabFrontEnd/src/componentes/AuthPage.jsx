import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const variants = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: { duration: 0.4, ease: "easeIn" },
    },
  };

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.5, ease: "easeOut" },
    },
  };

  return (
    <AuthLayout title={isLogin ? "Iniciar Sesión" : "Crear Cuenta"}>
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.form
            key="login"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-4 w-[320px]"
          >
            <label className="text-gray-200 text-sm font-semibold">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              className="p-3 rounded-md bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />

            <label className="text-gray-200 text-sm font-semibold">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              className="p-3 rounded-md bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />

            <button
              type="submit"
              className="mt-2 bg-yellow-400 text-black py-2 rounded-md font-bold hover:bg-yellow-500 transition"
            >
              Ingresar
            </button>

            <p className="text-gray-300 mt-3 text-sm text-center">
              ¿No tienes una cuenta?{" "}
              <span
                onClick={() => setIsLogin(false)}
                className="text-yellow-400 hover:underline cursor-pointer"
              >
                Regístrate
              </span>
            </p>

            {/* 🔹 Texto para volver al inicio */}
            <motion.p
              variants={fadeIn}
              initial="initial"
              animate="animate"
              className="text-gray-400 text-sm mt-2 cursor-pointer hover:text-yellow-400 transition text-left"
              onClick={() => navigate("/")}
            >
              ← Volver al inicio
            </motion.p>
          </motion.form>
        ) : (
          <motion.form
            key="register"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-4 w-[320px]"
          >
            <label className="text-gray-200 text-sm font-semibold">
              Nombre completo
            </label>
            <input
              type="text"
              placeholder="Ingresa tu nombre completo"
              className="p-3 rounded-md bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />

            <label className="text-gray-200 text-sm font-semibold">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              className="p-3 rounded-md bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />

            <label className="text-gray-200 text-sm font-semibold">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Crea una contraseña"
              className="p-3 rounded-md bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />

            <button
              type="submit"
              className="mt-2 bg-yellow-400 text-black py-2 rounded-md font-bold hover:bg-yellow-500 transition"
            >
              Registrarse
            </button>

            <p className="text-gray-300 mt-3 text-sm text-center">
              ¿Ya tienes cuenta?{" "}
              <span
                onClick={() => setIsLogin(true)}
                className="text-yellow-400 hover:underline cursor-pointer"
              >
                Inicia sesión
              </span>
            </p>

            {/* 🔹 Texto para volver al inicio */}
            <motion.p
              variants={fadeIn}
              initial="initial"
              animate="animate"
              className="text-gray-400 text-sm mt-2 cursor-pointer hover:text-yellow-400 transition text-left"
              onClick={() => navigate("/")}
            >
              ← Volver al inicio
            </motion.p>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
