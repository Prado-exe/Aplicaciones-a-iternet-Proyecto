import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../styles/ProyectosSection.css";

const proyectos = [
  { id: 1, nombre: "Sensor Ambiental", desc: "Monitorea aire y temperatura.", img: "https://prismab.com/wp-content/uploads/2023/11/8.jpg" },
  { id: 2, nombre: "Brazo Robótico", desc: "Brazo programable multiuso.", img: "https://www.esneca.com/wp-content/uploads/brazo-robotico.jpg" },
  { id: 3, nombre: "Cámara IoT", desc: "Vigilancia inteligente conectada.", img: "https://www.ventasdeseguridad.com/images/stories/VDS/2022/1product_m73_2_1510x848.jpg" },
  { id: 4, nombre: "Plotter DIY", desc: "Dibuja y corta por control computarizado.", img: "https://hackaday.com/wp-content/uploads/2023/10/diyplotter_feat.jpg" },
  { id: 5, nombre: "Cultivador Hidropónico", desc: "Sistema automático para plantas.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnk4ldDIqh6WcGvBnX2XYzZfFbELXwOr9a9g&s" },
  { id: 6, nombre: "LED Art", desc: "Instalación artística con LEDs.", img: "https://hyperspacelight.com/cdn/shop/files/HyperCubes-stacked-upon-each-other-to-create-an-LED-art-installation.jpg?v=1689270203&width=3000" },
  { id: 7, nombre: "Control Arduino", desc: "Automatización y domótica.", img: "https://electronicahobby.cl/wp-content/uploads/2024/01/MA2230.webp" },
  { id: 8, nombre: "Impresión 3D", desc: "Diseños personalizados impresos.", img: "https://cdn.artec3d.com/styles/540x380/s3/content-hub-images/how-does-a-3d-printer-work-01.jpg?VersionId=ZFCYg0t3fm4HgXOXfYedNwlGhNp2sbDG&itok=OYwUmTK3" },
];

function LazyCard({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return <div ref={ref}>{isVisible ? children : null}</div>;
}

export default function ProyectosSection() {
  const navigate = useNavigate();

  const handleMasProyectos = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => navigate("/pag-proyectos"), 350);
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-14">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
              Proyectos novedosos
            </h2>
            <div className="w-32 h-[3px] bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 mt-2 rounded-full animate-[pulse_3s_ease-in-out_infinite]" />
          </div>

          <button
            onClick={handleMasProyectos}
            className="mt-6 md:mt-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold py-2 px-6 rounded-lg hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,215,0,0.4)]"
          >
            Más proyectos
          </button>
        </div>

        {/* Grid de proyectos */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {proyectos.map((proy, index) => (
            <LazyCard key={proy.id}>
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-gray-800/40 border border-gray-700/60 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transform hover:scale-[1.03] transition-all duration-500"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={proy.img}
                    alt={proy.nombre}
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="p-5 text-center">
                  <h3 className="text-xl font-semibold text-yellow-300 mb-2">
                    {proy.nombre}
                  </h3>
                  <p className="text-sm text-gray-300">{proy.desc}</p>
                </div>
              </motion.div>
            </LazyCard>
          ))}
        </div>
      </div>
    </section>
  );
}
