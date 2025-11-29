import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/TalleresSection.css"; // puedes mantener el mismo estilo

export default function EventosSection() {
  const [eventos, setEventos] = useState([]);
  const navigate = useNavigate();

  const handleMasEventos = () => {
    navigate("/pag-noticiero");
  };

  // Fetch eventos según la configuración
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/eventos/config");
        const data = await res.json();

        const eventosData = (data.eventos || []).map(e => ({
          id: e._id,
          titulo: e.NombreEvento,
          desc: e.DescripcionEvento,
          img: e.RutaImagenEvento,
          fecha: e.FechaEvento // si quieres mostrar fecha
        }));

        setEventos(eventosData);
      } catch (err) {
        console.error("Error al cargar los eventos:", err);
      }
    };

    fetchEventos();
  }, []);

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-14">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
              Próximos eventos
            </h2>
            <div className="w-32 h-[3px] bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 mt-2 rounded-full animate-[pulse_3s_ease-in-out_infinite]" />
          </div>

          <button
            onClick={handleMasEventos}
            className="mt-6 md:mt-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold py-2 px-6 rounded-lg hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,215,0,0.4)]"
          >
            Más eventos
          </button>
        </div>

        {/* Tarjetas */}
        <div className="grid gap-10 md:grid-cols-3">
          {eventos.map((evento, index) => (
            <motion.div
              key={evento.id}
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transform hover:scale-[1.03] transition-all duration-500"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <img
                src={evento.img}
                alt={evento.titulo}
                className="w-full h-56 object-cover rounded-t-xl"
                loading="lazy"
              />
              <div className="p-6 text-center md:text-left">
                <h3 className="text-xl font-bold text-yellow-300 mb-3">{evento.titulo}</h3>
                {evento.fecha && <span className="block text-gray-400 text-sm mb-2">{evento.fecha}</span>}
                <p className="text-gray-300 text-sm leading-relaxed">{evento.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
