import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { handleRegister, handleLogin } from "../controllers/userController"; 
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  // modos: "login" | "register" | "forgot"
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();
  const { login } = useAuth(); 

  // Campos para login
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  // Campos para register
  const [nombre, setNombre] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");

  // Estado para mensajes de error
  const [errorMessage, setErrorMessage] = useState("");

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";

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

  async function onSubmitRegister(e) {
    e.preventDefault();
    setErrorMessage("");
    try {
      const { user, token } = await handleRegister({
        nombre,
        correo: emailRegister,
        contraseña: passwordRegister,
      });

      //AutoLogin
      login(user, token);
      navigate("/");

    } catch (error) {
      setErrorMessage(error.message || "Error al registrarse");
    }
  }


  async function onSubmitLogin(e) {
    e.preventDefault();
    setErrorMessage("");
    try {
      const { user, token } = await handleLogin({
        correo: emailLogin,
        contraseña: passwordLogin,
      });
      login(user, token);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || "Error al iniciar sesión");
    }
  }


  return (
    <AuthLayout title={title}>
      <AnimatePresence mode="wait">
        {/* LOGIN */}
        {isLogin && (
          <motion.form
            key="login"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-4 w-[320px]"
            onSubmit={onSubmitLogin}
          >
            <label className="text-gray-200 text-sm font-semibold">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              className="p-3 rounded-md bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={emailLogin}
              onChange={(e) => setEmailLogin(e.target.value)}
            />

            <label className="text-gray-200 text-sm font-semibold">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              className="p-3 rounded-md bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={passwordLogin}
              onChange={(e) => setPasswordLogin(e.target.value)}
            />

            {/* Link para recuperar contraseña */}
            <button
              type="button"
              className="text-xs text-yellow-400 hover:underline self-end -mt-1"
              onClick={() => setMode("forgot")}
            >
              ¿Olvidaste tu contraseña?
            </button>

            <button
              type="submit"
              className="mt-2 bg-yellow-400 text-black py-2 rounded-md font-bold hover:bg-yellow-500 transition"
            >
              Ingresar
            </button>

            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}

            <p className="text-gray-300 mt-3 text-sm text-center">
              ¿No tienes una cuenta?{" "}
              <span
                onClick={() => setMode("register")}
                className="text-yellow-400 hover:underline cursor-pointer"
              >
                Regístrate
              </span>
            </p>

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

        {/* REGISTRO */}
        {isRegister && (
          <motion.form
            key="register"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-4 w-[320px]"
            onSubmit={onSubmitRegister}
          >
            <label className="text-gray-200 text-sm font-semibold">
              Nombre completo
            </label>
            <input
              type="text"
              placeholder="Ingresa tu nombre completo"
              className="p-3 rounded-md bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <label className="text-gray-200 text-sm font-semibold">
              Nickname
            </label>
            <input
              type="text"
              placeholder="Ingresa tu nickname"
              className="p-3 rounded-md bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />

            <label className="text-gray-200 text-sm font-semibold">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              className="p-3 rounded-md bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={emailRegister}
              onChange={(e) => setEmailRegister(e.target.value)}
            />

            {/* Selector de rol */}
            <label className="text-gray-200 text-sm font-semibold">
              Rol en el FabLab
            </label>
            <select
              name="rolUsuario"
              defaultValue=""
              className="p-3 rounded-md bg-gray-800/70 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            >
              <option value="" disabled>
                Selecciona tu rol
              </option>
              <option value="Alumno">Alumno</option>
              <option value="Externo">Externo</option>
            </select>

            <label className="text-gray-200 text-sm font-semibold">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Crea una contraseña"
              className="p-3 rounded-md bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={passwordRegister}
              onChange={(e) => setPasswordRegister(e.target.value)}
            />

            <button
              type="submit"
              className="mt-2 bg-yellow-400 text-black py-2 rounded-md font-bold hover:bg-yellow-500 transition"
            >
              Registrarse
            </button>

            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}

            <p className="text-gray-300 mt-3 text-sm text-center">
              ¿Ya tienes cuenta?{" "}
              <span
                onClick={() => setMode("login")}
                className="text-yellow-400 hover:underline cursor-pointer"
              >
                Inicia sesión
              </span>
            </p>

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