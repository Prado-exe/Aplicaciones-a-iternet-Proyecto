const API_URL = import.meta.env.VITE_API_URL;

export async function crearSolicitudConProyectoExistente(token, payload) {
  const formData = new FormData();

  // Campos de la solicitud
  formData.append("IDR_Proyecto", payload.IDR_Proyecto);
  formData.append("TipoSolicitud", payload.TipoSolicitud);
  formData.append("DescripcionSolicitud", payload.DescripcionSolicitud || "");

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

  const res = await fetch(`${API_URL}/solicitudes/con-proyecto`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || "Error al crear solicitud");
  }
  return data.data; 
}

export async function crearSolicitudYProyectoNuevo(token, payload) {
  const formData = new FormData();

  // Datos del proyecto
  formData.append("NombreProyecto", payload.NombreProyecto);
  formData.append("DescripcionProyecto", payload.DescripcionProyecto || "");

  // Datos de la solicitud
  formData.append("TipoSolicitud", payload.TipoSolicitud);
  formData.append("DescripcionSolicitud", payload.DescripcionSolicitud || "");

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

  const res = await fetch(`${API_URL}/solicitudes/con-nuevo-proyecto`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data.error || data.message || "Error al crear solicitud y proyecto"
    );
  }
  return data.data; 
}
