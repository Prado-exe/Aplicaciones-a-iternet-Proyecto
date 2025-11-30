import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UniqueDivider from "./UniqueDivider";
import { useAuth } from "../context/AuthContext";
import { getMyProjects, createProject,/*deleteProject*/downloadProjectFile} from "../api/proyectService";


const LOCAL_KEY = "portfolioEntriesFabLab";

const PagMisProyectos = () => {
  //Estado para visualizar imagen mas grande de Detalle proyectos
  const [zoomImage, setZoomImage] = useState(null);

  //Autenticacion de usuario
  const { user, token, isAuthenticated } = useAuth();
  
  // Historial de registros en el FabLab (modo demo)
  const [entries, setEntries] = useState([]);

  // Proyecto seleccionado en el workspace
  const [selectedId, setSelectedId] = useState(null);

  // Formulario de nuevo registro
  const [formData, setFormData] = useState({
    titulo: "", 
    descripcion: "",
  });

  // Manejo simple de imágenes 
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  //Para limitar candtidad de Archivos/Imagenes
  const MAX_IMAGES = 3;
  const MAX_FILES = 2;

  const [fileFiles, setFileFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]); 
  
  // Cargar y guardar una copia en el front de los proyectos consultando al backend
  useEffect(() => {
    // Si no hay token, no llamamos api
    if (!token) return;

    const fetchProjects = async () => {
      try {
        const proyectos = await getMyProjects(token);

        // Mapeo
        const mapped = proyectos.map((p) => ({
          id: p._id,
          titulo: p.NombreProyecto,
          descripcion: p.DescripcionProyecto || "",
          // solo URLs de imagenes 
          imagenes: Array.isArray(p.imagenes) && p.imagenes.length > 0
            ? p.imagenes.map((img) => img.url)
            : [],
          // objetos completos para archivos
          archivos: Array.isArray(p.archivos) && p.archivos.length > 0
            ? p.archivos
            : [],
          fecha: p.FechaCreacion ? new Date(p.FechaCreacion).toLocaleDateString() : "",
          hora: p.FechaCreacion
            ? new Date(p.FechaCreacion).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          solicitudes: Array.isArray(p.IDR_Solicitudes)
            ? p.IDR_Solicitudes.map((s) => ({
                id: s._id,
                tipo: s.TipoSolicitud,
                fecha: s.FechaReserva
                  ? new Date(s.FechaReserva).toLocaleDateString()
                  : null,
              }))
            : [],
        }));
        //Guardamos en setEntries cada documento de la coleccion proyectos 
        setEntries(mapped);
        if (mapped.length > 0) {
          setSelectedId(mapped[0].id); //Guarda id de los proyectos de mongodb
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


  const handleFileChange = (e) => {
    //Leer archivos selecionados
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    //variables para separar entre imagenes y otros archivos
    const imageCandidates = [];
    const fileCandidates = [];

    //Filtrar en base al tipo de archivo (Imagen/archivo)
    files.forEach((file) => {
      if (file.type && file.type.startsWith("image/")) {
        // ej: "image/png", "image/jpeg"
        imageCandidates.push(file);
      } else {
        // todo lo que no sea image/*
        fileCandidates.push(file);
      }
    });

    //Agregar IMÁGENES candidatas al setImageFiles -> Para mandar al backend -> estos se usaran en handlesubmit
    setImageFiles((prevFiles) => {
      const availableSlots = MAX_IMAGES - prevFiles.length;
      if (availableSlots <= 0) return prevFiles;

      const toAdd = imageCandidates.slice(0, availableSlots);
      return [...prevFiles, ...toAdd];
    });

    //Guarda las imagenes en el preview -> Para mostrar en UI al seleccionar una imagen
    setImagePreviews((prevPreviews) => {
      const availableSlots = MAX_IMAGES - prevPreviews.length;
      if (availableSlots <= 0) return prevPreviews;

      const toAdd = imageCandidates
        .slice(0, availableSlots)
        .map((file) => ({
          url: URL.createObjectURL(file),
          name: file.name,
          type: file.type,
        }));

      return [...prevPreviews, ...toAdd];
    });

    //Misma logica que en imagenes
    if (fileCandidates.length > 0) {
      
      setFileFiles((prev) => {
        const availableSlots = MAX_FILES - prev.length;
        if (availableSlots <= 0) return prev;

        const toAdd = fileCandidates.slice(0, availableSlots);
        return [...prev, ...toAdd];
      });

      setFilePreviews((prev) => {
        const availableSlots = MAX_FILES - prev.length;
        if (availableSlots <= 0) return prev;

        const toAdd = fileCandidates.slice(0, availableSlots).map((file) => ({
          name: file.name,
          type: file.type,
        }));

        return [...prev, ...toAdd];
      });
    }

  };


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.titulo.trim()) return;

  try {
    //Mandar al backend con los inputs de la UI
    const created = await createProject(token, {
      NombreProyecto: formData.titulo.trim(),
      DescripcionProyecto: formData.descripcion.trim(),
      imagenFiles: imageFiles,
      archivoFiles: fileFiles,   
    });

    console.log("Respuesta al crear proyecto:", created); 

    //Con el objeto created(Respuesta devuelta por la bd) extraigo la informacion

    const createdDate = created.FechaCreacion
      ? new Date(created.FechaCreacion)
      : new Date();

    // Normalizar imágenes que vienen del backend
    const imagenes =
      Array.isArray(created.imagenes) && created.imagenes.length > 0
        ? created.imagenes.map((img) => img.url)
        : created.imagen?.url
          ? [created.imagen.url]
          : [];

    const archivos =
      Array.isArray(created.archivos) && created.archivos.length > 0
        ? created.archivos
        : [];

    //Contruimos la copia del objeto en un estado del front
    const newEntry = {
      id: created._id,
      titulo: created.NombreProyecto,
      descripcion: created.DescripcionProyecto || "",
      imagenes,
      archivos, 
      fecha: createdDate.toLocaleDateString(),
      hora: createdDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    setSelectedId(newEntry.id);

    // 3) Limpiar formulario y previews
    setFormData({
      titulo: "",
      descripcion: "",
    });
    setImageFiles([]);
    setImagePreviews([]);
    setFileFiles([]);
    setFilePreviews([]);
  } catch (err) {
    console.error("Error al crear proyecto:", err);
  }
};


  const handleSelectEntry = (id) => {
    setSelectedId(id);
  };

  const handleDeleteEntry = async (id) => {
    /*
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
      */
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
    <>
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
                    
                    {/* Listado de solicitudes asociadas */}
                    {Array.isArray(selectedEntry.solicitudes) &&
                      selectedEntry.solicitudes.length > 0 && (
                        <div className="mt-4">
                          <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                            Solicitudes asociadas a este proyecto
                          </p>
                          <ul className="text-sm text-gray-200 space-y-1">
                            {selectedEntry.solicitudes.map((sol) => (
                              <li key={sol.id} className="flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-yellow-400" />
                                <span className="font-medium text-yellow-300">
                                  {sol.tipo}
                                </span>
                                {sol.fecha && (
                                  <span className="text-[11px] text-gray-400 ml-2">
                                    · {sol.fecha}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {/* Aqui se muestran las imagenes rescatadas directamente de cloudinary */}
                    {selectedEntry.imagenes && selectedEntry.imagenes.length > 0 && (
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                          Imágenes asociadas
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {selectedEntry.imagenes.map((url, idx) => (
                            <button
                              key={`${selectedEntry.id}-img-${idx}`}
                              type="button"
                              onClick={() => setZoomImage(url)}  //abrir modal con esta imagen
                              className="bg-[#1e1e24] rounded-xl overflow-hidden border border-yellow-500/30 
                                        hover:border-yellow-400 hover:shadow-[0_0_14px_rgba(255,215,0,0.4)]
                                        transition transform hover:-translate-y-[2px] focus:outline-none"
                            >
                              <img
                                src={url}
                                alt={`Imagen ${idx + 1}`}
                                className="w-full h-28 object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}


                    {/* Archivos Rescatados de Cloudinary*/}
                    {selectedEntry.archivos && selectedEntry.archivos.length > 0 && (
                      <div className="mt-4">
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                          Archivos asociados
                        </p>
                        <div className="space-y-2">
                          {selectedEntry.archivos.map((file, idx) => (
                            <button
                                key={`${selectedEntry.id}-file-${idx}`}
                                type="button"
                                onClick={() => downloadProjectFile(token,selectedEntry.id,idx,file.originalName)}
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

            {/* Imagen del proyecto (archivo subido) */}
            <div>
              <label className="block text-sm mb-1">
                Imagen del proyecto (opcional)
              </label>
              <div className="flex flex-col sm:flex-row gap-2 items-start">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="text-sm text-gray-300
                            file:mr-2 file:px-3 file:py-2
                            file:rounded-full file:border-0
                            file:bg-yellow-500 file:text-black
                            file:cursor-pointer
                            file:font-semibold
                            hover:file:bg-yellow-400"
                />
              </div>
                {/* Previews de IMÁGENES */}
                  {Array.isArray(imagePreviews) && imagePreviews.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-400 mb-1">Imágenes seleccionadas</p>
                      <div className="grid grid-cols-3 gap-3">
                        {imagePreviews.map((preview, idx) => (
                          <div
                            key={idx}
                            className="w-32 rounded-xl overflow-hidden border border-yellow-500/40 bg-[#1e1e24]"
                          >
                            <img
                              src={preview.url}
                              alt={preview.name}
                              className="w-full h-24 object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lista de ARCHIVOS*/}
                  {Array.isArray(filePreviews) && filePreviews.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-400 mb-1">Archivos adjuntos</p>
                      <ul className="text-xs text-gray-300 list-disc list-inside space-y-1">
                        {filePreviews.map((file, idx) => (
                          <li key={idx}>
                            {file.name}{" "}
                            <span className="text-[10px] text-gray-500">
                              ({file.type || "tipo desconocido"})
                            </span>
                          </li>
                        ))}
                      </ul>
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
     {/*NUEVO->Modal con zoom para las imagenes de preview(detalle de cada proyecto)*/}         
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
};

export default PagMisProyectos;
