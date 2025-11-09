import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/TalleresSection.css";

const talleres = [
  {
    id: 1,
    nombre: "Taller de Modelado 3D",
    desc: "Aprende a diseñar y modelar piezas en 3D, desde la idea hasta el archivo para impresión.",
    img: "https://crehana-blog.imgix.net/media/filer_public/ef/4d/ef4ddf09-2d7b-41a4-8d6c-213b5111d4eb/modelado-de-bordes.jpg?auto=format&q=50",
  },
  {
    id: 2,
    nombre: "Arduino",
    desc: "Introducción interactiva al mundo de la electrónica y la programación con Arduino.",
    img: "https://i0.wp.com/dronebotworkshop.com/wp-content/uploads/2023/04/dronebotworkshop-arduino-uno.png?fit=347%2C246&ssl=1",
  },
  {
    id: 3,
    nombre: "Taller de Unity",
    desc: "Primeros pasos en el desarrollo de videojuegos y simulaciones 3D con Unity.",
    img: "https://unity.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Ffuvbjjlp%2Fproduction%2F6d1df49565a2ad20ffa8386f1465ba52039133e3-1920x1080.png&w=3840&q=75",
  },
];

export default function TalleresSection() {
  const navigate = useNavigate();

  const handleMasTalleres = () => {
    navigate("/pag-talleres");
  };

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

        {/* Tarjetas */}
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
