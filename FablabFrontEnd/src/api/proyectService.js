const API_URL = import.meta.env.VITE_API_URL;

// crear
export async function createProject(token, payload) {
  const res = await fetch(`${API_URL}/proyectos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message);
  return data.data;
}

// listar mios
export async function getMyProjects(token) {
  const res = await fetch(`${API_URL}/proyectos/mios`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message);
  return data.data;
}

//Obtener info de un proyecto por id
export async function getProjectById(token, projectId) {
  const res = await fetch(`${API_URL}/proyectos/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message);
  return data.data;
}

//Editar un proyecto
export async function updateProject(token, projectId, payload) {
  const res = await fetch(`${API_URL}/proyectos/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message);
  return data.data;
}

//Eliminar un proyecto
export async function deleteProject(token, projectId) {
  const res = await fetch(`${API_URL}/proyectos/${projectId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al eliminar proyecto");
  }

  return data;
}