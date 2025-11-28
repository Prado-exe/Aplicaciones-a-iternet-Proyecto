const API_URL = import.meta.env.VITE_API_URL;

// crear
export async function createProject(token, payload) { //Payload es el objeto con la info de los inputs del usuario
  
  //Creo el contenedor para empaquetar en el formData
  const formData = new FormData();

  // Campos de texto
  formData.append("NombreProyecto", payload.NombreProyecto);
  formData.append("DescripcionProyecto", payload.DescripcionProyecto || "");

  // Imagenes
  if (Array.isArray(payload.imagenFiles) && payload.imagenFiles.length > 0) {
    payload.imagenFiles.forEach((file) => {
      formData.append("imagenFiles", file);
    });
  }

  // Archivos
  if (Array.isArray(payload.archivoFiles) && payload.archivoFiles.length > 0) {
    payload.archivoFiles.forEach((file) => {
      formData.append("archivoFiles", file);
    });
  }

  //Enviamos el request al backend
  const res = await fetch(`${API_URL}/proyectos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || "Error al crear proyecto");
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

/*
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
*/

// Descargar archivo de un proyecto
export async function downloadProjectFile(token, projectId, fileIndex, fileName) {
  const res = await fetch(
    `${API_URL}/proyectos/${projectId}/archivos/${fileIndex}/descargar`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,   
      },
    }
  );

  if (!res.ok) {
    throw new Error("No se pudo descargar el archivo");
  }

  //Aqui trabaja ya con el archivo devuelto del backend-mongodb
  const blob = await res.blob();
  const blobUrl = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = fileName || "archivo";
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(blobUrl);
}
