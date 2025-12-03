import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/TalleresSection.css";

export default function TalleresSection() {
  const [talleres, setTalleres] = useState([]);
  const navigate = useNavigate();

  const handleMasTalleres = () => {
    navigate("/Pag-noticiero");
  };

  useEffect(() => {
    const fetchTalleres = async () => {
      try {
        // 1. Pedir TODOS los eventos
        const eventosRes = await fetch("/api/eventos");
        const eventos = await eventosRes.json();

        // 2. Pedir la configuración de talleres
        const cfgRes = await fetch("/api/talleres/config");
        const cfg = await cfgRes.json();

        const idsSeleccionados = cfg.config?.talleres_mostrados || [];

        // 3. Filtrar solo talleres (TipoEvento === 1)
        const soloTalleres = eventos.filter(ev => ev.TipoEvento === 1);

        // 4. Filtrar solo los seleccionados en admin
        const talleresMostrados = soloTalleres.filter(t =>
          idsSeleccionados.includes(t._id)
        );

        // 5. Adaptar formato para el componente
        const finalData = talleresMostrados.map(t => ({
          id: t._id,
          nombre: t.NombreEvento,
          desc: t.DescripcionEvento,
          img: t.imagen?.url || t.RutaImagenEvento || "" // prioridad cloudinary
        }));

        setTalleres(finalData);
      } catch (err) {
        console.error("Error al cargar los talleres destacados:", err);
      }
    };

    fetchTalleres();
  }, []);

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-14">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
              Talleres destacados
            </h2>
            <div className="w-32 h-[3px] bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 mt-2 rounded-full animate-[pulse_3s_ease-in-out_infinite]" />
          </div>

          <button
            onClick={handleMasTalleres}
            className="mt-6 md:mt-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold py-2 px-6 rounded-lg hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,215,0,0.4)]"
          >
            Más talleres
          </button>
        </div>

        {/* Cards */}
        <div className="grid gap-10 md:grid-cols-3">
          {talleres.map((taller, index) => (
            <motion.div
              key={taller.id}
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transform hover:scale-[1.03] transition-all duration-500"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <img
                src={taller.img}
                alt={taller.nombre}
                className="w-full h-56 object-cover rounded-t-xl"
                loading="lazy"
              />
              <div className="p-6 text-center md:text-left">
                <h3 className="text-xl font-bold text-yellow-300 mb-3">{taller.nombre}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{taller.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
