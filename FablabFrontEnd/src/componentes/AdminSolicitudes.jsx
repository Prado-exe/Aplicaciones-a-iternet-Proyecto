import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { downloadProjectFile } from "../api/proyectService";


export default function AdminSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("todas"); // todas | pendientes | aceptadas
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const { token } = useAuth();
  const [zoomImage, setZoomImage] = useState(null); 

  
  const fetchSolicitudes = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/solicitudes/admin");
      if (!res.ok) throw new Error("Error al cargar solicitudes");
      const data = await res.json();
      setSolicitudes(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };



  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const actualizarEstado = async (id, estado) => {
    try {
      const res = await fetch(`http://localhost:5000/api/solicitudes/admin/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ EstadoSolicitud: estado }),
      });

      if (!res.ok) throw new Error("No se pudo actualizar la solicitud");

      setSolicitudes((prev) =>
        prev.map((s) => (s._id === id ? { ...s, EstadoSolicitud: estado } : s))
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // FILTRADO
  const solicitudesFiltradas = solicitudes.filter((s) => {
    if (filtro === "pendientes") return s.EstadoSolicitud === false;
    if (filtro === "aceptadas") return s.EstadoSolicitud === true;
    return true; // todas
  });

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  

  return (
    <>
      {/* ----------------------------- FILTROS ----------------------------- */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-xl border ${
            filtro === "todas" ? "bg-yellow-500 text-black" : "bg-[#0f0f13] border-yellow-500 text-yellow-400"
          }`}
          onClick={() => setFiltro("todas")}
        >
          Todas
        </button>

        <button
          className={`px-4 py-2 rounded-xl border ${
            filtro === "pendientes" ? "bg-yellow-500 text-black" : "bg-[#0f0f13] border-yellow-500 text-yellow-400"
          }`}
          onClick={() => setFiltro("pendientes")}
        >
          Pendientes
        </button>

        <button
          className={`px-4 py-2 rounded-xl border ${
            filtro === "aceptadas" ? "bg-yellow-500 text-black" : "bg-[#0f0f13] border-yellow-500 text-yellow-400"
          }`}
          onClick={() => setFiltro("aceptadas")}
        >
          Aceptadas
        </button>
      </div>

      {/* ----------------------------- LISTA DE SOLICITUDES ----------------------------- */}
      <div className="space-y-4">
        {solicitudesFiltradas.map((s) => (

          <div
            key={s._id}
            className="flex justify-between p-4 bg-[#0f0f13] border border-yellow-500/20 rounded-xl cursor-pointer"
            onClick={() => setProyectoSeleccionado(s.IDR_Proyecto)}
          >
            <div>
              <p><b>Proyecto:</b> {s.IDR_Proyecto?.NombreProyecto || "Sin nombre"}</p>
              <p><b>Tipo:</b> {s.TipoSolicitud}</p>
              <p><b>Fecha:</b> {new Date(s.FechaReserva).toLocaleString()}</p>
              <p>
                <b>Estado:</b>{" "}
                {s.EstadoSolicitud ? (
                  <span className="text-green-400">Aceptada</span>
                ) : (
                  <span className="text-red-400">Pendiente</span>
                )}
              </p>
              {/* Contador de imagenes/Archivos*/}
              <p className="text-sm text-gray-400 mt-1">
                <b>Adjuntos:</b>{" "}
                {(s.IDR_Proyecto?.imagenes?.length || 0)} imágenes y{" "}
                {(s.IDR_Proyecto?.archivos?.length || 0)} archivos
              </p>
            </div>

            {!s.EstadoSolicitud && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); actualizarEstado(s._id, true); }}
                  className="bg-green-500 text-black px-3 py-2 rounded hover:scale-105 transition"
                >
                  Aceptar
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); actualizarEstado(s._id, false); }}
                  className="bg-red-500 text-black px-3 py-2 rounded hover:scale-105 transition"
                >
                  Rechazar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ----------------------------- MODAL DE PROYECTO ----------------------------- */}
      {proyectoSeleccionado && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-6">
          <div className="bg-[#1a1a1f] border border-yellow-500/30 p-6 rounded-xl w-full max-w-lg relative">
            <button
              className="absolute top-3 right-3 text-red-400 text-xl"
              onClick={() => setProyectoSeleccionado(null)}
            >
              ×
            </button>

            <h2 className="text-yellow-400 text-xl font-bold mb-4">
              Información del Proyecto
            </h2>

            <p><b>Nombre:</b> {proyectoSeleccionado.NombreProyecto}</p>
            <p><b>Descripción:</b> {proyectoSeleccionado.DescripcionProyecto}</p>
            <p><b>Fecha creación:</b>  {new Date(proyectoSeleccionado.FechaCreacion).toLocaleString()}</p>
            
            {/* IMGNS DEL PROYECTO */}
            {Array.isArray(proyectoSeleccionado.imagenes) &&
              proyectoSeleccionado.imagenes.length > 0 && (
                <div className="mt-4">
                  <p className="text-yellow-400 text-sm mb-2">
                    Imágenes asociadas al proyecto
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {proyectoSeleccionado.imagenes.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`Imagen ${idx + 1}`}
                        className="w-full h-28 object-cover rounded-lg border border-yellow-500/30 cursor-pointer hover:opacity-80 transition"
                        onClick={() => setZoomImage(img.url)}
                      />
                    ))}
                  </div>
                </div>
              )}

            {/* ARCHIVOS DEL PROYECTO */}
            {Array.isArray(proyectoSeleccionado.archivos) &&
              proyectoSeleccionado.archivos.length > 0 && (
                <div className="mt-4">
                  <p className="text-yellow-400 text-sm mb-2">
                    Archivos asociados al proyecto
                  </p>

                  <div className="space-y-2">
                    {proyectoSeleccionado.archivos.map((file, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          downloadProjectFile(
                            token,
                            proyectoSeleccionado._id,
                            idx,
                            file.originalName
                          )
                        }
                        className="flex items-center gap-2 text-sm text-yellow-300 hover:text-yellow-200 underline"
                      >
                        <i className="bi bi-file-earmark-arrow-down" />
                        {file.originalName || `Archivo ${idx + 1}`}
                        <span className="text-[10px] text-gray-400">
                          ({file.mimeType || "archivo"})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-yellow-500 text-black rounded hover:scale-105 transition"
                onClick={() => setProyectoSeleccionado(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {/*Modal con zoom para las imagenes de preview(detalle de cada proyecto)*/}         
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomImage(null)}
              className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full w-8 h-8 
                        flex items-center justify-center text-sm font-bold shadow-lg
                        hover:bg-red-500 transition"
            >
              ✕
            </button>

            <img
              src={zoomImage}
              alt="Vista ampliada"
              className="w-full max-h-[90vh] object-contain rounded-2xl border border-yellow-400/70 
                        shadow-[0_0_30px_rgba(255,215,0,0.4)] bg-black"
            />
          </div>
        </div>
      )}
    </>
  );
}
