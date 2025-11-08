//Logica de usuario en front
import { registerUser,loginUser } from "../api/userService";

//Validacion del registro del usuario
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

//validacion del login del usuario -- incluyendo su token respectivo
export async function handleLogin({ correo, contraseña }) {
  if (!correo || !contraseña) throw new Error("Faltan credenciales");

  const { token, user } = await loginUser({
    CorreoUsuario: correo,
    ContraUsuario: contraseña,
  });

  // Guardar sesión local
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return user;
}