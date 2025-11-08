import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import loginImg from "../assets/fablab.png";
import { handleLogin } from "../controllers/userController";


function LoginPage() {

  //inputs
  const [correo, setEmail] = useState("");
  const [contraseña, setPassword] = useState("");
  const navigate = useNavigate();
  
  //Funcion para validar
  const onLogin = async (e) => {
      e.preventDefault();
      try {
        await handleLogin({ correo, contraseña });
        alert("Inicio de sesión exitoso");
          navigate("/");

      } catch (err) {
        alert(err.message || "Error al iniciar sesión");
      }
    };

  return (
    <div className="auth-split">
      <div className="auth-panel">
        <div className="glass-box">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={onLogin}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Ingresar</button>
          </form>
          <p>
            ¿No tienes cuenta?{" "}
            <a href="/register">Regístrate</a>
          </p>
        </div>
      </div>

      <div className="auth-image">
        <img src={loginImg} alt="Login ilustración" />
      </div>
    </div>
  );
}

export default LoginPage;
