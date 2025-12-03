//Capa que habla con el backend
const API_URL = import.meta.env.VITE_API_URL;

//Registro usuario
export async function registerUser(userData) {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al registrar usuario");
  return data;
}

//Login usuario
export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al iniciar sesión");
  return data;
}

// obtener Perfil usuario 
export async function getProfile(token) {
  const res = await fetch(`${API_URL}/users/perfil`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, //Recuperar el token
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Error al obtener perfil");
  }

  return data.data; 
}

//Actualizar el perfil de usuario
export async function updateProfile(token, payload) {
  const res = await fetch(`${API_URL}/users/perfil`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Error al actualizar perfil");
  }

  return data.data; // el usuario actualizado
}

//Actualizar Contraseña del usuario
export async function changePassword(token, currentPassword, newPassword) {
  const res = await fetch(`${API_URL}/users/cambiar-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Error al cambiar contraseña");
  }

  return data.data; 
}


// Solicitar correo de recuperacion
export async function requestPasswordReset(email) {
  const res = await fetch(`${API_URL}/users/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al solicitar recuperación de contraseña");
  }

  return data; 
}

// Enviar nueva contraseña usando el token
export async function resetPasswordApi(token, newPassword) {
  const res = await fetch(`${API_URL}/users/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, newPassword }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al restablecer contraseña");
  }

  return data; // { success: true, message: "Contraseña actualizada correctamente" }
}
