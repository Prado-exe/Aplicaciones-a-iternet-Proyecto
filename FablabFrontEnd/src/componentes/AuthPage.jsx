import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
<<<<<<< HEAD
import { handleRegister, handleLogin } from "../controllers/userController"; // Ajusta según ruta real
=======
import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser,requestPasswordReset} from "../api/userService";


>>>>>>> Actualizacion-ultra-experimental-panel-admin

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
  const [nickname, setNickname] = useState("");

  // Campos para "olvidé mi contraseña"
  const [emailForgot, setEmailForgot] = useState("");

  // Mensaje informativo 
  const [infoMessage, setInfoMessage] = useState("");

  // Estado para mensajes de error
  const [errorMessage, setErrorMessage] = useState("");

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";

  // Campos para login
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  // Campos para register
  const [nombre, setNombre] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");

  // Estado para mensajes de error
  const [errorMessage, setErrorMessage] = useState("");

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
<<<<<<< HEAD
      await handleRegister({
        nombre,
        correo: emailRegister,
        contraseña: passwordRegister,
      });
      // Opcionalmente redirige o cambia a login tras registro
      setIsLogin(true);
      alert("Registro exitoso, por favor inicia sesión");
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

=======
      //CamposVacios
      if (!nombre || !nickname || !emailRegister || !passwordRegister) {throw new Error("Todos los campos son obligatorios");}
      
      //Registrar Usuario
      await registerUser({NombreUsuario: nombre,Nickname: nickname,CorreoUsuario: emailRegister,ContraUsuario: passwordRegister,});

      //AutoLogin
      const { token, user } = await loginUser({CorreoUsuario: emailRegister,ContraUsuario: passwordRegister,});

      //Guardar Sesion Global y redirigir
      login(user, token);
      navigate("/");

    } catch (error) {
      setErrorMessage(error.message || "Error al registrarse");
    }
  }


>>>>>>> Actualizacion-ultra-experimental-panel-admin
  async function onSubmitLogin(e) {
    e.preventDefault();
    setErrorMessage("");
    try {
<<<<<<< HEAD
      await handleLogin({
        correo: emailLogin,
        contraseña: passwordLogin,
      });
      // Redirigir tras login exitoso
      navigate("/"); // ejemplo a dashboard o ruta principal
    } catch (error) {
      setErrorMessage(error.message);
    }
  }
=======
      //Verificar existencia de credenciales
      if (!emailLogin || !passwordLogin) {setErrorMessage("Faltan credenciales");return;}

      //Logear usuario
      const { token, user } = await loginUser({CorreoUsuario: emailLogin,ContraUsuario: passwordLogin,});

      //Guardar sesion global y redirigir
      login(user, token);
      navigate("/");

    } catch (error) {
      setErrorMessage(error.message || "Error al iniciar sesión");
    }
  }
  
  //Campo para enviarCorreo de recuperacion
  async function onSubmitForgot(e) {
  e.preventDefault();
  setErrorMessage("");
  setInfoMessage("");

  if (!emailForgot.trim()) {
    setErrorMessage("Debes ingresar un correo");
    return;
  }

  try {
    const res = await requestPasswordReset(emailForgot.trim());
    setInfoMessage(
      res.message || "Si el correo está registrado, recibirás instrucciones."
    );
  } catch (error) {
    setErrorMessage(
      error.message || "Ocurrió un error al solicitar la recuperación"
    );
  }
}

  const title =
    mode === "login"
      ? "Iniciar Sesión"
      : mode === "register"
      ? "Crear Cuenta"
      : "Recuperar contraseña";
>>>>>>> Actualizacion-ultra-experimental-panel-admin

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

<<<<<<< HEAD
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
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              className="p-3 rounded-md bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={emailRegister}
              onChange={(e) => setEmailRegister(e.target.value)}
            />

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
                onClick={() => setIsLogin(true)}
                className="text-yellow-400 hover:underline cursor-pointer"
              >
                Inicia sesión
              </span>
            </p>

=======
            {/* Volver al inicio */}
>>>>>>> Actualizacion-ultra-experimental-panel-admin
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
            className="flex flex-col gap-2 w-[320px]"
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
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
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

            {/* Volver al inicio */}
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

        {/* RECUPERAR CONTRASEÑA */}
        {isForgot && (
          <motion.form
            key="forgot"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-4 w-[320px]"
            onSubmit={onSubmitForgot}     //Submit de recuperar          
          >
            <label className="text-gray-200 text-sm font-semibold">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="Ingresa el correo con el que te registraste"
              className="p-3 rounded-md bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={emailForgot} 
              onChange={(e) => setEmailForgot(e.target.value)}
            />

            <p className="text-xs text-gray-300">
              Recibirás un correo con instrucciones para restablecer tu
              contraseña
            </p>

            {/* Mensajes de error / éxito */}
            {errorMessage && (
              <p className="text-red-500 text-xs">{errorMessage}</p>
            )}

            {infoMessage && (
              <p className="text-green-400 text-xs">{infoMessage}</p>
            )}

            <button
              type="submit"
              className="mt-2 bg-yellow-400 text-black py-2 rounded-md font-bold hover:bg-yellow-500 transition"
            >
              Enviar instrucciones
            </button>

            <p className="text-gray-300 mt-3 text-sm text-center">
              ¿Recordaste tu contraseña?{" "}
              <span
                onClick={() => {
                  setMode("login");
                  setErrorMessage("");
                  setInfoMessage("");
                }}
                className="text-yellow-400 hover:underline cursor-pointer"
              >
                Inicia sesión
              </span>
            </p>

            {/* Volver al inicio */}
            <motion.p
              variants={fadeIn}
              initial="initial"
              animate="animate"
              className="text-gray-400 text-sm mt-2 cursor-pointer hover:text-yellow-400 transition text-left"
              onClick={() => {
                setErrorMessage("");
                setInfoMessage("");
                navigate("/");
              }}
            >
              ← Volver al inicio
            </motion.p>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}