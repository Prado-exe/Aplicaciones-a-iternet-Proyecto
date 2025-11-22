import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UniqueDivider from "./UniqueDivider";
import { useAuth } from "../context/AuthContext";
import { getMyProjects, createProject,deleteProject } from "../api/proyectService";


const LOCAL_KEY = "portfolioEntriesFabLab";

const PagMisProyectos = () => {

  const { user, token, isAuthenticated } = useAuth();
  
  // Historial de registros en el FabLab (modo demo)
  const [entries, setEntries] = useState([]);

  // Proyecto seleccionado en el workspace
  const [selectedId, setSelectedId] = useState(null);

  // Formulario de nuevo registro
  const [formData, setFormData] = useState({
    titulo: "", 
    tecnologias: "",
    descripcion: "",
  });

  // Manejo simple de imágenes (URLs) para el registro nuevo
  const [newImageUrl, setNewImageUrl] = useState("");
  const [tempImages, setTempImages] = useState([]);

  // Cargar proyectos reales desde el backend
  useEffect(() => {
    // Si no hay token, no llamamos api
    if (!token) return;

    const fetchProjects = async () => {
      try {
        const proyectos = await getMyProjects(token);

        // Mapeo sencillo: adapto nombres del backend a los que usa la UI
        const mapped = proyectos.map((p) => ({
          id: p._id, // id de Mongo
          titulo: p.NombreProyecto,
          descripcion: p.DescripcionProyecto || "",
          // Campos extra pueden venir de backend en el futuro
          imagenes: [], // por ahora vacío, porque aún no lo guardas en BD
          fecha: p.FechaCreacion
            ? new Date(p.FechaCreacion).toLocaleDateString()
            : "",
          hora: p.FechaCreacion
            ? new Date(p.FechaCreacion).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
        }));

        setEntries(mapped);
        if (mapped.length > 0) {
          setSelectedId(mapped[0].id);
        }
      } catch (err) {
        console.error("Error cargando proyectos:", err);
      }
    };

    fetchProjects();
  }, [token]);

  // Asegurar que siempre haya un seleccionado si existen entries
  useEffect(() => {
    if (entries.length > 0 && !selectedId) {
      setSelectedId(entries[0].id);
    }
  }, [entries, selectedId]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    setTempImages((prev) => [...prev, trimmed]);
    setNewImageUrl("");
  };

  const handleRemoveTempImage = (url) => {
    setTempImages((prev) => prev.filter((u) => u !== url));
  };

  const persistEntries = (list) => {
    setEntries(list);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titulo.trim()) return;

    try {
      // 1) Mandar al backend con los nombres que espera tu servicio
      const created = await createProject(token, {
        NombreProyecto: formData.titulo.trim(),
        DescripcionProyecto: formData.descripcion.trim(),
      });

      const createdDate = created.FechaCreacion
        ? new Date(created.FechaCreacion)
        : new Date();

      const newEntry = {
        id: created._id,
        titulo: created.NombreProyecto,
        descripcion: created.DescripcionProyecto || "",
        imagenes: tempImages, // de momento solo en frontend
        fecha: createdDate.toLocaleDateString(),
        hora: createdDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const updated = [newEntry, ...entries];
      setEntries(updated);
      setSelectedId(newEntry.id);

      // 3) Limpiar formulario
      setFormData({
        titulo: "",
        tecnologias: "",
        descripcion: "",
      });
      setTempImages([]);
      setNewImageUrl("");
    } catch (err) {
      console.error("Error al crear proyecto:", err);
      // Aquí podrías mostrar un mensaje de error en pantalla si quieres
    }
  };


  const handleSelectEntry = (id) => {
    setSelectedId(id);
  };

  const handleDeleteEntry = async (id) => {
    try {
      //Eliminar en BD
      await deleteProject(token, id);

      //Actualiza arreglo local
      const filtered = entries.filter((e) => e.id !== id);
      setEntries(filtered);

      if (filtered.length === 0) {
        setSelectedId(null);
      } else if (id === selectedId) {
        setSelectedId(filtered[0].id);
      }
    } catch (err) {
      console.error("Error eliminando proyecto:", err);
      alert("No se pudo eliminar el proyecto.");
    }
  };


  if (!isAuthenticated) {
    return (
      <div className="pt-24 min-h-screen bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f] flex items-center justify-center text-gray-200">
        <p className="text-lg">
          No hay una sesión activa. Inicia sesión para gestionar tu historial en el FabLab.
        </p>
      </div>
    );
  }

  const displayName =
    user.Nickname ||
    user.NombreUsuario ||
    "Usuario";

  const selectedEntry = entries.find((e) => e.id === selectedId) || null;

  const detailVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, ease: "easeOut" },
    },
    exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f] text-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-10">
        {/* Título principal */}
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400 mb-3 drop-shadow-[0_0_12px_rgba(255,215,0,0.7)]">
            Mi Portafolio en el FabLab
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Registra las actividades y proyectos que realizas dentro del FabLab:
            impresiones 3D, cortes láser, prototipos electrónicos, etc. Esta
            sección funciona como tu historial personal de trabajo.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Sesión activa como{" "}
            <span className="text-yellow-300 font-semibold">
              {displayName}
            </span>
          </p>
        </header>

        <UniqueDivider />

        {/* 🔹 Panel grande con borde dorado que envuelve ambas columnas */}
        <section className="bg-[#15151b] rounded-3xl p-4 md:p-6 border border-yellow-500/35 shadow-[0_0_25px_rgba(255,215,0,0.22)]">
          <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] gap-6">
            {/* Workspace / lista de registros */}
            <div className="bg-[#101114] rounded-3xl p-5 md:p-6 border border-yellow-500/30 shadow-[0_0_18px_rgba(255,215,0,0.15)] flex flex-col">
              <h2 className="text-xl font-semibold text-yellow-400 mb-3">
                Historial de proyectos
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Selecciona un registro para ver el detalle. Al final de la lista
                puedes crear uno nuevo.
              </p>

              {/* Lista scrollable (altura fija aprox. 6–7 items) */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[430px]">
                {entries.length === 0 ? (
                  <p className="text-sm text-gray-300">
                    Aún no tienes actividades registradas. Crea tu primer registro
                    usando el formulario de abajo.
                  </p>
                ) : (
                  entries.map((entry) => {
                    const isActive = entry.id === selectedId;
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => handleSelectEntry(entry.id)}
                        className={`w-full text-left px-4 py-3 rounded-2xl border transition-all duration-300 flex flex-col gap-1 group transform ${
                          isActive
                            ? "bg-[#22222b] border-yellow-500 shadow-[0_0_18px_rgba(255,215,0,0.4)]"
                            : "bg-[#1b1b21] border-yellow-500/25 hover:border-yellow-400 hover:shadow-[0_0_16px_rgba(255,215,0,0.35)] hover:-translate-y-[2px]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm text-gray-100 truncate">
                            {entry.titulo}
                          </span>
                          <span className="text-[11px] text-gray-400 whitespace-nowrap">
                            {entry.fecha} · {entry.hora}
                          </span>
                        </div>
                        {entry.equipo && (
                          <p className="text-[11px] text-gray-400 truncate">
                            Equipo:{" "}
                            <span className="text-yellow-200">
                              {entry.equipo}
                            </span>
                          </p>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Botón crear nuevo que hace scroll al formulario */}
              <a
                href="#nuevo-registro"
                className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-full bg-yellow-500 text-black text-sm font-semibold hover:bg-yellow-400 transition shadow-[0_0_12px_rgba(255,215,0,0.6)]"
              >
                + Nuevo registro
              </a>
            </div>

            {/* Panel de detalle */}
            <div className="bg-[#101114] rounded-3xl p-5 md:p-7 border border-yellow-500/25 shadow-[0_0_18px_rgba(255,215,0,0.15)]">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">
                Detalle de la actividad
              </h2>

              <AnimatePresence mode="wait">
                {selectedEntry ? (
                  <motion.div
                    key={selectedEntry.id}
                    variants={detailVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                  >
                    {/* Título */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-100">
                        {selectedEntry.titulo}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Registrado el{" "}
                        <span className="text-yellow-200">
                          {selectedEntry.fecha} · {selectedEntry.hora}
                        </span>
                      </p>
                    </div>

                    {/* Descripción */}
                    <div className="text-sm">
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                        Descripción de la actividad
                      </p>
                      <p className="text-gray-200 whitespace-pre-line leading-relaxed">
                        {selectedEntry.descripcion ||
                          "Sin descripción registrada para esta actividad."}
                      </p>
                    </div>

                    {/* Imágenes */}
                    {selectedEntry.imagenes && selectedEntry.imagenes.length > 0 && (
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                          Imágenes asociadas
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {selectedEntry.imagenes.map((url, idx) => (
                            <div
                              key={`${selectedEntry.id}-img-${idx}`}
                              className="bg-[#1e1e24] rounded-xl overflow-hidden border border-yellow-500/30"
                            >
                              <img
                                src={url}
                                alt={`Imagen ${idx + 1}`}
                                className="w-full h-28 object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Acciones sobre el registro */}
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDeleteEntry(selectedEntry.id)}
                        className="text-xs px-4 py-2 rounded-full border border-red-500/70 text-red-300 hover:bg-red-500/10 transition"
                      >
                        Eliminar registro (demo)
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.p
                    key="no-selection"
                    variants={detailVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-sm text-gray-300"
                  >
                    Selecciona un registro en la columna izquierda para ver el
                    detalle, o crea uno nuevo usando el formulario de abajo.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <UniqueDivider />

        {/* Formulario para crear nuevo registro */}
        <section
          id="nuevo-registro"
          className="bg-[#15151b] rounded-3xl p-6 md:p-8 border border-yellow-500/30 shadow-[0_0_22px_rgba(255,215,0,0.18)]"
        >
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
            Crear un nuevo proyecto en tu portafolio
          </h2>
          <p className="text-sm text-gray-300 mb-4">
            Aquí puedes documentar una proyecto específico que realizaste en el
            FabLab: por ejemplo, una impresión 3D, un corte láser, una prueba de
            prototipo, etc.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">
                Título de la proyecto
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={handleChange("titulo")}
                className="w-full rounded-xl px-3 py-2 bg-[#1b1b21] border border-yellow-500/60 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Ej: Impresión 3D de pieza para robot"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Descripción del proyecto
              </label>
              <textarea
                value={formData.descripcion}
                onChange={handleChange("descripcion")}
                className="w-full rounded-xl px-3 py-2 bg-[#1b1b21] border border-yellow-500/40 focus:outline-none focus:ring-2 focus:ring-yellow-500 min-h-[100px]"
                placeholder="¿Qué hiciste? ¿Cuál era el objetivo? ¿Qué resultado obtuviste?"
              />
            </div>

            {/* Imágenes (URLs por ahora, para que luego backend lo reemplace por uploads reales) */}
            <div>
              <label className="block text-sm mb-1">
                Imágenes asociadas (URL) – modo demo
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 rounded-xl px-3 py-2 bg-[#1b1b21] border border-yellow-500/40 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                  placeholder="Pega aquí la URL de una imagen (ej: de Drive, Imgur, etc.)"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 rounded-full bg-yellow-500 text-black text-sm font-semibold hover:bg-yellow-400 transition shadow-[0_0_10px_rgba(255,215,0,0.6)]"
                >
                  Añadir imagen
                </button>
              </div>
              {tempImages.length > 0 && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {tempImages.map((url) => (
                    <div
                      key={url}
                      className="relative bg-[#1e1e24] rounded-xl overflow-hidden border border-yellow-500/30"
                    >
                      <img
                        src={url}
                        alt="Preview"
                        className="w-full h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTempImage(url)}
                        className="absolute top-1 right-1 text-[10px] px-2 py-1 rounded-full bg-black/70 text-gray-200 hover:bg-black"
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-yellow-500 text-black font-semibold px-6 py-2 rounded-full hover:bg-yellow-400 transition shadow-[0_0_12px_rgba(255,215,0,0.6)]"
              >
                Guardar registro (demo)
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default PagMisProyectos;
