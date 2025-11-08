import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import loginImg from "../assets/fablab.png";


function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("✅ Inicio de sesión exitoso");
        navigate("/");
      } else {
        alert(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="auth-split">
      <div className="auth-panel">
        <div className="glass-box">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
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
