import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import registerImg from "../assets/fablab.png";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
        navigate("/login");
      } else {
        alert(data.message || "Error al registrar usuario.");
      }
    } catch (error) {
      console.error("Error al registrarse:", error);
    }
  };

  return (
    <div className="auth-split">
      <div className="auth-panel">
        <div className="glass-box">
          <h2>Crear Cuenta</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
