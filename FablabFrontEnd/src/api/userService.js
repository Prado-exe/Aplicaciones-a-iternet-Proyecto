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