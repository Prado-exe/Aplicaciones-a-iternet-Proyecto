import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/AreasSection.css";

const areas = [
  {
    id: 1,
    nombre: "Impresión 3D",
    desc: "Crea prototipos y piezas personalizadas con tecnologías de fabricación aditiva.",
    img: "https://hacedores.com/wp-content/uploads/2024/03/Replicator-la-impresora-3D-que-utiliza-la-luz-para-crear-objetos-copia-e1711563345534-1080x567.webp",
  },
  {
    id: 2,
    nombre: "Cortadora Láser",
    desc: "Cortes y grabados de alta precisión en acrílico, MDF, cartón y más.",
    img: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Cortadora_Laser_-_FabLAB_Newton.jpg",
  },
  {
    id: 3,
    nombre: "Realidad Virtual (RV)",
    desc: "Experimenta simulaciones e interacción inmersiva a través de dispositivos VR.",
    img: "https://i.blogs.es/3e7bdd/realidad-virtual/1366_2000.jpg",
  },
];

export default function AreasSection({ handleLinkClick }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (handleLinkClick) handleLinkClick(e);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => navigate("/pag-servicios"), 350);
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-14">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
              Áreas de trabajo
            </h2>
            <div className="w-32 h-[3px] bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 mt-2 rounded-full animate-[pulse_3s_ease-in-out_infinite]" />
          </div>

          <button
            onClick={handleClick}
            className="mt-6 md:mt-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold py-2 px-6 rounded-lg hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,215,0,0.4)]"
          >
            Más áreas
          </button>
        </div>

        {/* Tarjetas */}
        <div className="grid gap-10 md:grid-cols-3">
          {areas.map((area, index) => (
            <motion.div
              key={area.id}
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transform hover:scale-[1.03] transition-all duration-500"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <img
                src={area.img}
                alt={area.nombre}
                className="w-full h-56 object-cover rounded-t-xl"
                loading="lazy"
              />
              <div className="p-6 text-center md:text-left">
                <h3 className="text-xl font-bold text-yellow-300 mb-3">{area.nombre}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{area.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
