//Logica de usuario en front
import { registerUser,loginUser } from "../api/userService";

//Validacion del registro del usuario
export async function handleRegister({ nombre, nickname, correo, contraseña }) {
  if (!nombre || !nickname || !correo || !contraseña) {
    throw new Error("Todos los campos son obligatorios");
  }

  await registerUser({
    NombreUsuario: nombre,
    Nickname: nickname,
    CorreoUsuario: correo,
    ContraUsuario: contraseña,
  });

  const { token, user } = await loginUser({
    CorreoUsuario: correo,
    ContraUsuario: contraseña,
  });

  return { user, token };
}

//validacion del login del usuario -- incluyendo su token respectivo
export async function handleLogin({ correo, contraseña }) {
  if (!correo || !contraseña) throw new Error("Faltan credenciales");

  const { token, user } = await loginUser({
    CorreoUsuario: correo,
    ContraUsuario: contraseña,
  });
  return { user, token };
}
