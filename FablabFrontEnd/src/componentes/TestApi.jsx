// src/pages/TestApi.jsx
import { useState } from "react";
import { handleRegister} from "../controllers/userController";

export default function TestApi() {
  const [msg, setMsg] = useState("");
  async function testRegister() {
    try {
      const data = await handleRegister({
        nombre: "Cris",
        correo: "cristianpruebadesdefront@demo.com",
        contraseña: "123456",
      });
      setMsg("Registro exitoso: " + JSON.stringify(data));
    } catch (err) {
      setMsg("Error: " + err.message);
    }
  }

  return (
    <div className="p-6">
      <h1>🧪 Pruebas API Backend</h1>
      <button onClick={testRegister}>Probar Registro</button>
      <pre>{msg}</pre>
    </div>
  );
}
