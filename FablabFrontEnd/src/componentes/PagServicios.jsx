import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footbar"; 
import UniqueDivider from "./UniqueDivider";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import imgAR from "../assets/medium-shot-man-wearing-vr-glasses.png";
import { useAuth } from "../context/AuthContext";
import {crearSolicitudConProyectoExistente,crearSolicitudYProyectoNuevo} from "../api/solicitudService";
import { getMyProjects} from "../api/proyectService";

const LOCAL_KEY = "portfolioEntriesFabLab";

export default function PagServicios() {
  const bloques = [
    {
      id: "laser",
      titulo: "Corte y Grabado Láser",
      desc: `Nuestra cortadora láser permite realizar cortes y grabados de alta precisión en
      madera, acrílico, cartón y otros materiales. Es ideal para crear prototipos, maquetas
      arquitectónicas, piezas personalizadas y trabajos artísticos, ofreciendo acabados limpios
      y gran velocidad de producción.`,
      img: "https://ecut.cl/wp-content/uploads/2021/05/Laser-EL-6040.webp",
    },
    {
      id: "impresion3d",
      titulo: "Impresión 3D",
      desc: `Con nuestra zona de impresión 3D puedes materializar cualquier diseño en pocas horas.
      Desde piezas funcionales hasta modelos de exposición, disponemos de impresoras de filamento
      y resina que ofrecen diferentes niveles de detalle y resistencia, acompañadas de asesoría
      para preparar correctamente tus archivos y configuraciones.`,
      img: "https://mecaluxcl.cdnwm.com/blog/img/impresora-3d-logistica.1.0.jpg",
    },
    {
      id: "electronica",
      titulo: "Electrónica y Robótica",
      desc: `Espacio equipado para el desarrollo de circuitos, soldadura, programación de
      microcontroladores y pruebas de prototipos electrónicos. Contamos con herramientas e
      instrumentación básica, además de orientación para que puedas llevar a cabo proyectos de
      robótica, IoT o automatización.`,
      img: "https://a.storyblok.com/f/169662/1200x627/4958ad2943/proyectos-de-electro-nica-y-robo-tica.jpg",
    },
    {
      id: "vr",
      titulo: "Realidad Virtual (VR)",
      desc: `Área dedicada a experiencias completamente inmersivas donde el usuario entra en entornos digitales creados en 3D. Permite simular escenarios complejos, recorrer prototipos arquitectónicos, experimentar productos antes de fabricarlos y realizar entrenamientos seguros sin riesgo en el mundo físico. Ideal para simulaciones, validación de ideas y demostraciones interactivas en contexto controlado.`,
      img: "https://userena.cl/images/imagenes_articulos/uls_noticias/2023/junio/nota_junio_19_1_1.jpg",
    },
    {
      id: "ar",
      titulo: "Realidad Aumentada (AR)",
      desc: `Espacio orientado a experiencias que mezclan el mundo real con contenido digital superpuesto en tiempo real. Permite visualizar modelos 3D sobre mesas, maquetas o superficies físicas, agregar capas de información a proyectos, guiar procesos paso a paso y crear demostraciones interactivas sin aislar al usuario de su entorno. Ideal para presentaciones a clientes, educación y apoyo en procesos de diseño y fabricación.`,
      img: imgAR,
    },
  ];

  //token Para la autenticacion
  const {token} = useAuth();

  // Proyectos del usuario obtenidos desde el backend
  const [projects, setProjects] = useState([]);

  //Cargamos los proyectos del usuario llamando al backend y se asignan a proyects
  useEffect(() => {
    if (!token) return;

    const fetchProjects = async () => {
      try {
        const proyectos = await getMyProjects(token);

        const mapped = proyectos.map((p) => ({
          id: p._id,
          titulo: p.NombreProyecto || "Proyecto sin título",
          imagenCount: Array.isArray(p.imagenes) ? p.imagenes.length : 0,
          archivoCount: Array.isArray(p.archivos) ? p.archivos.length : 0,
        }));

        setProjects(mapped);
      } catch (error) {
        console.error("Error cargando proyectos para solicitudes:", error);
      }
    };

    fetchProjects();
  }, [token]);


  return (
    <>
      <Navbar />

      <main className="pt-24 bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f] text-gray-200 min-h-screen">
        {/* Encabezado */}
        <header className="text-center py-16 px-4">
          <h1 className="text-5xl font-extrabold text-yellow-400 mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
            Servicios del FABLAB
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Equipamiento y acompañamiento para transformar tus ideas en prototipos reales.
          </p>
        </header>

        {/* Contenido */}
        <div className="max-w-6xl mx-auto flex flex-col gap-24 px-6 pb-20">
          {bloques.map((b, i) => (
            <ServiceCard
              key={b.id}
              bloque={b}
              index={i}
              projects={projects}
            />
          ))}

          <UniqueDivider />

          <p className="text-gray-400 text-center italic">
            “El conocimiento y la creatividad son los motores de la innovación.”
          </p>
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </>
  );
}

/* ======================================
   Card de servicio con modo info / solicitud
   ====================================== */

function ServiceCard({ bloque, index, projects}) {
  const [mode, setMode] = useState("info"); // "info" | "request(abre el formulario para solicitar un servicio)"
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);  //Loading cuando creen solicitudes 
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  console.log("Projects en ServiceCard:", projects);

  // Layout alternado:
  // - En modo "info" usamos el patrón que ya tenías (alterna por índice).
  // - En modo "request" invertimos el lado -> siempre cambia la posición imagen/form.
  const isInfoReversed = index % 2 !== 0; // true para 2ª, 4ª card, etc.

  const directionClass =
    mode === "info"
      ? isInfoReversed
        ? "md:flex-row-reverse"
        : "md:flex-row"
      : // en modo request invertimos
        isInfoReversed
        ? "md:flex-row"
        : "md:flex-row-reverse";

  
  const handleSubmitRequest = async (formValues) => {
    //Corroboramos que este autenticado
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    try {
      setErrorMsg("");
      setLoading(true);

      //Asigna a esta variable el servicio en el que estaba el usuario(impresora3d,laser,etc)
      const tipoSolicitud = mapServiceToTipoSolicitud(bloque.id);

      //Lee lo del formulario
      const {
        mode: modoAsociacion,
        descripcion,
        imagenFiles,
        archivoFiles,
        proyectoSeleccionado,
        nuevoProyectoTitulo,
        nuevoProyectoDesc,
      } = formValues;

      //Identificar que tipo de proyecto eligio el usuario(Si existe o tiene que crear uno)
      if (modoAsociacion === "existing") {
        if (!proyectoSeleccionado) {
          throw new Error("Debes seleccionar un proyecto existente.");
        }
        
        //Llama al backend con los inputs elegidos por el usuario
        await crearSolicitudConProyectoExistente(token, {
          IDR_Proyecto: proyectoSeleccionado,
          TipoSolicitud: tipoSolicitud,
          DescripcionSolicitud: descripcion,
          imagenFiles,
          archivoFiles,
        });
      } else if (modoAsociacion === "new") { //Si eligio nuevo proyecto
        if (!nuevoProyectoTitulo) {
          throw new Error("Debes ingresar el título del nuevo proyecto.");
        }
        
        //Llama al backend con los inputs elegidos por el usuario
        await crearSolicitudYProyectoNuevo(token, {
          NombreProyecto: nuevoProyectoTitulo,
          DescripcionProyecto: nuevoProyectoDesc || "",
          TipoSolicitud: tipoSolicitud,
          DescripcionSolicitud: descripcion,
          imagenFiles,
          archivoFiles,
        });
      } else {
        throw new Error(
          "Debes elegir si quieres asociar a un proyecto existente o crear uno nuevo."
        );
      }

      alert("Solicitud enviada correctamente ✨");
      setMode("info");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Error al enviar la solicitud");
    } finally {
    setLoading(false);//Loading siempre
  }
  };

  //Mapeo para identificar en que servicio(de la vista) esta el usuario
  const mapServiceToTipoSolicitud = (serviceId) => {
    switch (serviceId) {
      case "laser":
        return "Corte y grabado Laser";

      case "impresion3d":
        return "Impresora 3D";

      case "electronica":
        return "Electrónica y Robótica";

      case "vr":
        return "Realidad Virtual";

      case "ar":
        return "Realidad Aumentada";

      default:
        return "Realidad Virtual"; 
    }
  };

  const handleOpenForm = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    setMode("request");
  };

  return (
    <motion.section
      className={`flex flex-col ${directionClass} items-center gap-10
      bg-[#0e0e12]/90 border border-yellow-500/10 rounded-2xl
      shadow-[0_0_25px_rgba(255,215,0,0.1)] p-6`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Texto / Formulario */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {mode === "info" ? (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            >
              <h2 className="text-3xl font-bold text-yellow-400 mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.4)]">
                {bloque.titulo}
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">{bloque.desc}</p>
              <button
                onClick={handleOpenForm}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-2 rounded-full shadow-lg transition-all duración-300 hover:scale-105"
              >
                Solicitar servicio
              </button>
            </motion.div>
          ) : (
              <ServiceRequestForm
                key="form"
                serviceName={bloque.titulo}
                projects={projects}
                onCancel={() => setMode("info")}
                onSubmit={handleSubmitRequest}
                errorMsg={errorMsg}
                loading={loading} 
              />
          )}
        </AnimatePresence>
      </div>

      {/* Imagen */}
      <figure className="flex-1 flex justify-center">
        <img
          src={bloque.img}
          alt={bloque.titulo}
          loading="lazy"
          className="rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.15)] hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] transition-all duration-500"
        />
      </figure>
    </motion.section>
  );
}

  /* ============================
    Formulario de solicitud
    ============================ */

  function ServiceRequestForm({
    serviceName,
    projects,
    onCancel,
    onSubmit,
    errorMsg,
    loading,
  }) {

    const MAX_IMAGES = 3;
    const MAX_FILES = 2;

    //Preview de imagenes
    const [imagePreviews, setImagePreviews] = useState([]);

    const [descripcion, setDescripcion] = useState("");

    const [imageFiles, setImageFiles] = useState([]);
    const [fileFiles, setFileFiles] = useState([]);

    // "" = nada seleccionado, "existing" | "new"
    const [modoAsociacion, setModoAsociacion] = useState("");
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState("");
    const [nuevoProyectoTitulo, setNuevoProyectoTitulo] = useState("");
    const [nuevoProyectoDesc, setNuevoProyectoDesc] = useState("");

    const selectedProject =
      modoAsociacion === "existing"
        ? projects.find((p) => p.id === proyectoSeleccionado)
        : null;

    //Cuenta las imagenes y archivos ya guardados en un proyecto(Para controlar no que exceda en solicitudes el limite de Archivos/Imgs)
    const currentImgCount = selectedProject?.imagenCount || 0;
    const currentFileCount = selectedProject?.archivoCount || 0;

    //Cuenta las imagenes y archivos que puede guardar el usario considerando la capacidad max
    const availableImgSlots = Math.max(
      0,
      MAX_IMAGES - currentImgCount - imageFiles.length
    );

    const availableFileSlots = Math.max(
      0,
      MAX_FILES - currentFileCount - fileFiles.length
    );
  const handleFileChange = (e) => {

    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const imageCandidates = [];
    const fileCandidates = [];

    //Separamos imagenes de archivos
    files.forEach((file) => {
      if (file.type && file.type.startsWith("image/")) {
        imageCandidates.push(file);
      } else {
        fileCandidates.push(file);
      }
    });

    // IMAGENES 
    if (availableImgSlots > 0 && imageCandidates.length > 0) {
      const toAdd = imageCandidates.slice(0, availableImgSlots);

      setImageFiles((prev) => [...prev, ...toAdd]);//Imagenes que se agregaran al backend

      const newPreviews = toAdd.map((file) => ({ //Setear imagenes preliminares de las seleccionada para mostrarlas en la UI
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type,
      }));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }

    //ARCHIVOS
    if (availableFileSlots > 0 && fileCandidates.length > 0) {
      const toAdd = fileCandidates.slice(0, availableFileSlots);
      setFileFiles((prev) => [...prev, ...toAdd]); //Archivos que se agregaran al backend
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!modoAsociacion) {
      alert(
        "Selecciona si quieres asociar la solicitud a un proyecto existente o crear uno nuevo."
      );
      return;
    }

    const payload = {
      mode: modoAsociacion,          
      descripcion,
      imagenFiles: imageFiles,
      archivoFiles: fileFiles,
      proyectoSeleccionado,
      nuevoProyectoTitulo,
      nuevoProyectoDesc,
    };

    await onSubmit(payload);

    // limpiar 
    setDescripcion("");
    setImageFiles([]);
    setImagePreviews([]);
    setFileFiles([]);
    setModoAsociacion("");
    setProyectoSeleccionado("");
    setNuevoProyectoTitulo("");
    setNuevoProyectoDesc("");
  };


  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      className="space-y-4 text-sm md:text-base"
    >
      <h3 className="text-2xl font-semibold text-yellow-400 mb-2">
        Solicitud de servicio
      </h3>
      <p className="text-gray-300 mb-3 text-sm">
        Estás solicitando:{" "}
        <span className="font-semibold text-yellow-300">{serviceName}</span>
      </p>

      {/* Descripción */}
      <div>
        <label className="block text-gray-300 mb-1">
          Describe brevemente qué necesitas
        </label>
        <textarea
          className="w-full rounded-xl bg-black/40 border border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 px-3 py-2 text-sm md:text-base text-gray-100 resize-none"
          rows={4}
          placeholder="Ej: Necesito cortar piezas en MDF de 3mm para un prototipo..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
      </div>

      {/* Archivo / imagen */}
      <div>
        <label className="block text-gray-300 mb-1">
          Archivos / Imágenes de referencia (opcional)
        </label>
        <input
          type="file"
          multiple
          className="w-full text-gray-300 text-xs md:text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-yellow-500/90 file:text-black hover:file:bg-yellow-400 cursor-pointer"
          onChange={handleFileChange}
        />

        {/* Info de cupo cuando es proyecto EXISTENTE */}
        {modoAsociacion === "existing" && selectedProject && (
        <p className="mt-1 text-[11px] text-gray-400">
          Este proyecto ya tiene{" "}
          <span className="text-yellow-300">{currentImgCount}</span> imágenes y{" "}
          <span className="text-yellow-300">{currentFileCount}</span> archivos.
          Puedes agregar hasta{" "}
          <span className="text-yellow-300">{availableImgSlots}</span> imágenes y{" "}
          <span className="text-yellow-300">{availableFileSlots}</span> archivos más.
        </p>
        )}

        {/* PREVIEW SOLO DE IMAGENES */}
        {Array.isArray(imagePreviews) && imagePreviews.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-400 mb-1">Imágenes seleccionadas</p>
            <div className="grid grid-cols-3 gap-3">
              {imagePreviews.map((preview, idx) => (
                <div
                  key={idx}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden border border-yellow-500/40 bg-[#1e1e24]"
                >
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/*ARCHIVOS*/}
        {fileFiles.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-400 mb-1">Archivos adjuntos</p>
            <ul className="text-xs text-gray-300 list-disc list-inside space-y-1">
              {fileFiles.map((file, idx) => (
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

      {/* Asociación a proyecto */}
      <div className="mt-4 border border-gray-700/70 rounded-2xl p-3 md:p-4 bg-black/30">
        <p className="text-sm md:text-base font-medium text-gray-100 mb-2">
          Asociar esta solicitud a un proyecto
        </p>

        <div className="space-y-2 text-sm md:text-base">
          <label className="flex items-center gap-2 text-gray-300">
            <input
              type="radio"
              className="text-yellow-400 focus:ring-yellow-500"
              value="existing"
              checked={modoAsociacion === "existing"}
              onChange={() => setModoAsociacion("existing")}
            />
            <span>Asociar a un proyecto existente</span>
          </label>

          {modoAsociacion === "existing" && (
            <div className="mt-2">
              <select
                className="w-full rounded-xl bg-black/40 border border-gray-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 px-3 py-2 text-gray-100"
                value={proyectoSeleccionado}
                onChange={(e) => setProyectoSeleccionado(e.target.value)}
              >
                <option value="">Selecciona un proyecto...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.titulo}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label className="flex items-center gap-2 text-gray-300">
            <input
              type="radio"
              className="text-yellow-400 focus:ring-yellow-500"
              value="new"
              checked={modoAsociacion === "new"}
              onChange={() => setModoAsociacion("new")}
            />
            <span>Crear un nuevo proyecto con esta solicitud</span>
          </label>

          {modoAsociacion === "new" && (
            <div className="mt-2 space-y-2">
              <input
                type="text"
                className="w-full rounded-xl bg-black/40 border border-gray-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 px-3 py-2 text-gray-100 text-sm md:text-base"
                placeholder="Título del nuevo proyecto"
                value={nuevoProyectoTitulo}
                onChange={(e) => setNuevoProyectoTitulo(e.target.value)}
                required
              />
              <textarea
                className="w-full rounded-xl bg-black/40 border border-gray-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 px-3 py-2 text-gray-100 text-sm md:text-base resize-none"
                rows={3}
                placeholder="Descripción breve del proyecto (opcional)"
                value={nuevoProyectoDesc}
                onChange={(e) => setNuevoProyectoDesc(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
      

      {/* Errores */}    
      {errorMsg && (
        <p className="text-red-400 text-xs md:text-sm mt-2">{errorMsg}</p>
      )}

      {/* Botones */}
      <div className="flex flex-wrap gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-gray-600 text-gray-200 hover:bg-gray-800/70 transition-colors text-sm md:text-base"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-yellow-500 text-black font-semibold shadow-[0_0_15px_rgba(250,204,21,0.8)] hover:bg-yellow-400 transition-colors text-sm md:text-base"
          disabled={loading}  
        >
        {loading ? "Enviando..." : "Enviar solicitud"}        
        </button>
      </div>
      
    </motion.form>
  );
}
