//Logica de usuario en front
import { registerUser } from "../api/userService";

export async function handleRegister({ nombre, correo, contraseña }) {
  if (!nombre || !correo || !contraseña) {
    throw new Error("Todos los campos son obligatorios");
  }
  return await registerUser({
    NombreUsuario: nombre,
    CorreoUsuario: correo,
    ContraUsuario: contraseña,
  });
}
