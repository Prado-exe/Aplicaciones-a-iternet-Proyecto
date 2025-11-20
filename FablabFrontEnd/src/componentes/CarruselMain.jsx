import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/CarruselMain.css";

const slides = [
  {
    src: "https://fablab.fiuls.cl/wp-content/uploads/2024/08/Grafica-Mousepad-FABLAB-1.png",
    tipo: "Eventos",
    titulo: "Jam de Videojuegos",
    descripcion:
      "Maratón creativa donde equipos desarrollan prototipos de videojuegos en pocos días.",
  },
  {
    src: "https://fablab.fiuls.cl/wp-content/uploads/2024/08/IMG_6160-scaled.jpg",
    tipo: "Servicios",
    titulo: "Impresión 3D",
    descripcion:
      "Servicio de fabricación aditiva para prototipos funcionales y piezas personalizadas.",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Cortadora_Laser_-_FabLAB_Newton.jpg",
    tipo: "Servicios",
    titulo: "Corte Láser",
    descripcion:
      "Cortes de alta precisión en acrílico, MDF y más. Ideal para prototipos y maquetas.",
  },
];

export default function CarruselMain({ style }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef(null);
  const length = slides.length;

  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % length);
    }, 6000);
  };

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prevSlide = () => {
    clearInterval(intervalRef.current);
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + length) % length);
    startAutoSlide();
  };

  const nextSlide = () => {
    clearInterval(intervalRef.current);
    setDirection(1);
    setCurrent((prev) => (prev + 1) % length);
    startAutoSlide();
  };

  const prevIndex = (current - 1 + length) % length;
  const nextIndex = (current + 1) % length;

  const centerVariants = {
    enter: (dir) => ({
      x: dir === 1 ? 90 : -90,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1.08,
    },
    exit: (dir) => ({
      x: dir === 1 ? -90 : 90,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section
      className="relative h-[90vh] overflow-hidden -mt-[1px] bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f]"
      style={style}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-black/85 via-black/40 to-transparent" />

      <div className="relative h-full flex flex-col items-center justify-center px-4">
        <div className="relative w-full max-w-6xl h-[70vh] flex items-center justify-center">
          {/* FLECHA IZQUIERDA */}
          <button
            onClick={prevSlide}
            className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-11 h-11 rounded-full border border-yellow-400/60 bg-black/60 text-yellow-300 hover:bg-yellow-400 hover:text-black shadow-[0_0_20px_rgba(250,204,21,0.6)] transition-all"
            aria-label="Anterior"
          >
            <i className="bi bi-chevron-left text-2xl" />
          </button>

          {/* FLECHA DERECHA */}
          <button
            onClick={nextSlide}
            className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-11 h-11 rounded-full border border-yellow-400/60 bg-black/60 text-yellow-300 hover:bg-yellow-400 hover:text-black shadow-[0_0_20px_rgba(250,204,21,0.6)] transition-all"
            aria-label="Siguiente"
          >
            <i className="bi bi-chevron-right text-2xl" />
          </button>

          {/* GHOST IZQUIERDO – VISIBLE A LA IZQUIERDA */}
          <div className="pointer-events-none absolute left-[-7vw] top-1/2 -translate-y-1/2 w-[40vw] max-w-2xl h-[40vw] max-h-[460px] rounded-[24px] overflow-hidden border border-yellow-400/35 bg-black shadow-[0_0_26px_rgba(250,204,21,0.35)] opacity-50 blur-[2px] scale-95 z-10"
>
            <div className="relative w-full h-full">
              <img
                src={slides[prevIndex].src}
                alt={slides[prevIndex].titulo}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5">
                <span className="px-3 py-1 rounded-full bg-yellow-400 text-black text-[10px] font-semibold uppercase tracking-[0.18em] shadow-md">
                  {slides[prevIndex].tipo}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-yellow-300">
                  {slides[prevIndex].titulo}
                </h3>
              </div>
            </div>
          </div>

          {/* GHOST DERECHO – VISIBLE A LA DERECHA */}
          <div className="pointer-events-none absolute right-[-7vw] top-1/2 -translate-y-1/2 w-[40vw] max-w-2xl h-[40vw] max-h-[460px] rounded-[24px] overflow-hidden border border-yellow-400/35 bg-black shadow-[0_0_26px_rgba(250,204,21,0.35)] opacity-50 blur-[2px] scale-95 z-10">
            <div className="relative w-full h-full">
              <img
                src={slides[nextIndex].src}
                alt={slides[nextIndex].titulo}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5">
                <span className="px-3 py-1 rounded-full bg-yellow-400 text-black text-[10px] font-semibold uppercase tracking-[0.18em] shadow-md">
                  {slides[nextIndex].tipo}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-yellow-300">
                  {slides[nextIndex].titulo}
                </h3>
              </div>
            </div>
          </div>

          {/* CARD CENTRAL – UN POCO MÁS ANGOSTA PARA DEJAR VER LOS LADOS */}
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={centerVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.55,
                ease: [0.22, 0.61, 0.36, 1],
              }}
              className="relative w-[60vw] max-w-4xl h-[60vw] max-h-[500px] rounded-[32px] overflow-hidden border border-yellow-400/65 bg-black shadow-[0_0_70px_rgba(250,204,21,0.8)] z-20"
            >
              <div className="relative w-full h-full">
                <img
                  src={slides[current].src}
                  alt={slides[current].titulo}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* halos */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.3),transparent_55%)] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

                {/* header */}
                <div className="absolute top-5 left-6 right-6 flex justify-between items-start">
                  <span className="px-4 py-1 rounded-full bg-yellow-400 text-black text-[11px] font-semibold uppercase tracking-[0.18em] shadow-md">
                    {slides[current].tipo}
                  </span>
                  <span className="px-3 py-1 rounded-full border border-yellow-300/60 text-[11px] text-yellow-100/95 backdrop-blur-sm bg-black/60">
                    FABLAB&nbsp;FIULS
                  </span>
                </div>

                {/* texto principal */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-400 drop-shadow-[0_0_18px_rgba(250,204,21,0.8)]">
                    {slides[current].titulo}
                  </h2>
                  <p className="mt-2 text-[13px] md:text-sm text-gray-100/95 max-w-xl">
                    {slides[current].descripcion}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
  