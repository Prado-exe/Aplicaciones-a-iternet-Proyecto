import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import registerImg from "../assets/fablab.png";
import { handleRegister } from "../controllers/userController";

function RegisterPage() {
  //inputs
  const [nombre, setName] = useState("");
  const [correo, setEmail] = useState("");
  const [contraseña, setPassword] = useState("");
  const navigate = useNavigate();

  //Funcion para validar
  const onRegister = async (e) => {
    e.preventDefault();
    try {
      await handleRegister({ nombre, correo, contraseña });
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
    } catch (err) {
      alert(err.message || "Error al registrar usuario");
    }
  };


  return (
    <div className="auth-split">
      <div className="auth-panel">
        <div className="glass-box">
          <h2>Crear Cuenta</h2>
          <form onSubmit={onRegister}>
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
            <button type="submit">Registrarse</button>
          </form>
          <p>
            ¿Ya tienes cuenta?{" "}
            <a href="/login">Inicia sesión</a>
          </p>
        </div>
      </div>

      <div className="auth-image">
        <img src={registerImg} alt="Registro ilustración" />
      </div>
    </div>
  );
}

export default RegisterPage;
