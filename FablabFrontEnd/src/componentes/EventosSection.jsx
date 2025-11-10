import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import gamejamImg from "../assets/event_gamejam.png";
import laserImg from "../assets/event_laser.png";
import arduinoImg from "../assets/event_arduino.png";

const eventos = [
  {
    id: 1,
    titulo: "Game Jam",
    fecha: "20/09/2025",
    descripcion:
      "Maratón creativa donde equipos diseñan y programan videojuegos desde cero.",
    img: gamejamImg,
  },
  {
    id: 2,
    titulo: "Prototipado Rápido",
    fecha: "25/09/2025",
    descripcion:
      "Descubre cómo crear piezas y modelos funcionales con corte y grabado láser.",
    img: laserImg,
  },
  {
    id: 3,
    titulo: "Arduino Básico",
    fecha: "28/09/2025",
    descripcion:
      "Aprende electrónica desde cero y programa tus primeros sensores con Arduino.",
    img: arduinoImg,
  },
];

export default function EventosSection({ handleLinkClick }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (handleLinkClick) handleLinkClick(e);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-14">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-yellow-500 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
              Próximos eventos
            </h2>
            <div className="w-32 h-[3px] bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 mt-2 rounded-full animate-[pulse_3s_ease-in-out_infinite]" />
          </div>

          <Link
            to="/pag-noticiero"
            onClick={handleClick}
            className="mt-6 md:mt-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold py-2 px-6 rounded-lg hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,215,0,0.4)]"
          >
            Más eventos
          </Link>
        </div>

        {/* Tarjetas */}
        <div className="grid gap-10 md:grid-cols-3">
          {eventos.map((evento, index) => (
            <motion.div
              key={evento.id}
              className="relative bg-gray-800/80 text-white backdrop-blur-md border border-gray-700/50 rounded-xl overflow-hidden text-center shadow-lg hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transform hover:scale-[1.03] transition-all duration-500"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {/* Imagen */}
              <img
                src={evento.img}
                alt={evento.titulo}
                className="w-full h-48 object-cover"
              />

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-yellow-300 mb-2">
                  {evento.titulo}
                </h3>
                <span className="block text-sm text-gray-400 mb-3">
                  {evento.fecha}
                </span>
                <p className="text-gray-200 text-sm leading-relaxed">
                  {evento.descripcion}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
