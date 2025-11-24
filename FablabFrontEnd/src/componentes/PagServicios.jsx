import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import UniqueDivider from "./UniqueDivider";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import imgAR from "../assets/medium-shot-man-wearing-vr-glasses.png";

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

  // Proyectos del usuario leídos desde localStorage (modo demo)
  const [projects, setProjects] = useState([]);
  // Usuario logueado (modo demo, mismo que en PagMisProyectos)
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedEntries = localStorage.getItem(LOCAL_KEY);
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        const mapped = parsed.map((e) => ({
          id: e.id,
          titulo: e.titulo || "Proyecto sin título",
        }));
        setProjects(mapped);
      } catch (error) {
        console.error("Error leyendo proyectos desde localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error leyendo usuario desde localStorage", error);
      }
    }
  }, []);

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
              user={user}
            />
          ))}

          <UniqueDivider />

          <p className="text-gray-400 text-center italic">
            “El conocimiento y la creatividad son los motores de la innovación.”
          </p>
        </div>
      </main>
    </>
  );
}

/* ======================================
   Card de servicio con modo info / solicitud
   ====================================== */

function ServiceCard({ bloque, index, projects, user }) {
  const [mode, setMode] = useState("info"); // "info" | "request"
  const navigate = useNavigate();

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

  const handleSubmitRequest = (payload) => {
    console.log("[FRONT] Solicitud de servicio:", payload);
    setMode("info");
  };

  const handleOpenForm = () => {
    if (!user) {
      // ⚠️ Cambia "/auth" si tu ruta de login es otra
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
              serviceId={bloque.id}
              serviceName={bloque.titulo}
              projects={projects}
              onCancel={() => setMode("info")}
              onSubmit={handleSubmitRequest}
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
  serviceId,
  serviceName,
  projects,
  onCancel,
  onSubmit,
}) {
  const [descripcion, setDescripcion] = useState("");
  const [file, setFile] = useState(null);

  // "" = nada seleccionado, "existing" | "new"
  const [modoAsociacion, setModoAsociacion] = useState("");
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState("");
  const [nuevoProyectoTitulo, setNuevoProyectoTitulo] = useState("");
  const [nuevoProyectoDesc, setNuevoProyectoDesc] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!modoAsociacion) {
      alert(
        "Selecciona si quieres asociar la solicitud a un proyecto existente o crear uno nuevo."
      );
      return;
    }

    const payload = {
      type: "serviceRequest",
      serviceKey: serviceId,
      serviceName,
      description: descripcion,
      // fileReference se puede agregar cuando exista manejo de archivos
      projectAssociation: {
        mode: modoAsociacion, // "existing" | "new"
        projectId:
          modoAsociacion === "existing" ? proyectoSeleccionado : undefined,
        newProject:
          modoAsociacion === "new"
            ? {
                title: nuevoProyectoTitulo,
                description: nuevoProyectoDesc || undefined,
              }
            : undefined,
      },
    };

    onSubmit(payload);

    setDescripcion("");
    setFile(null);
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
          Archivo o imagen de referencia (opcional)
        </label>
        <input
          type="file"
          className="w-full text-gray-300 text-xs md:text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-yellow-500/90 file:text-black hover:file:bg-yellow-400 cursor-pointer"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {file && (
          <p className="mt-1 text-xs text-gray-400">
            Archivo seleccionado:{" "}
            <span className="text-yellow-300">{file.name}</span>
          </p>
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
        >
          Enviar solicitud
        </button>
      </div>
    </motion.form>
  );
}
