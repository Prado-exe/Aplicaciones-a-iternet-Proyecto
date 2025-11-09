import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/CarruselMain.css";

const slides = [
  {
    src: "https://fablab.fiuls.cl/wp-content/uploads/2024/08/Grafica-Mousepad-FABLAB-1.png",
    tipo: "Eventos",
    titulo: "Jam de videojuegos",
    descripcion: "Maratón creativa para diseñar y programar videojuegos en equipo",
  },
  {
    src: "https://fablab.fiuls.cl/wp-content/uploads/2024/08/IMG_6160-scaled.jpg",
    tipo: "Servicios",
    titulo: "Impresora 3D",
    descripcion: "Fabricación aditiva para prototipos funcionales y piezas personalizadas.",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Cortadora_Laser_-_FabLAB_Newton.jpg",
    tipo: "Servicios",
    titulo: "Cortadora Láser",
    descripcion: "Cortes de alta precisión para acrílico, MDF y más. Ideal para prototipos y maquetas.",
  },
];

function LazyImage({ src, alt, className }) {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) observer.unobserve(imgRef.current);
    };
  }, []);

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : ""}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
}

export default function CarruselMain() {
  const [opacity, setOpacity] = useState(1);
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(false);
  const intervalRef = useRef(null);
  const length = slides.length;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const newOpacity = Math.max(1 - (scrollTop / 400) * 0.6, 0);
      setOpacity(newOpacity);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
        setFade(false);
      }, 400);
    }, 6000);
  };

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, [length]);

  const prevSlide = () => {
    setFade(true);
    setTimeout(() => {
      setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
      setFade(false);
      startAutoSlide();
    }, 400);
  };

  const nextSlide = () => {
    setFade(true);
    setTimeout(() => {
      setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
      setFade(false);
      startAutoSlide();
    }, 400);
  };

  const slide = slides[current];

  return (
    <section className="relative h-[90vh] overflow-hidden" style={{ opacity }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.src}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <LazyImage
            src={slide.src}
            alt={slide.titulo || "Imagen principal"}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Degradado sutil con dorado */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-yellow-500/10"></div>

      {/* Texto principal */}
      <motion.div
        key={slide.titulo}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-28 left-10 text-white max-w-xl"
      >
        <span className="px-4 py-1 bg-yellow-400/90 text-black text-sm font-semibold rounded-full shadow-md uppercase tracking-wider">
          {slide.tipo}
        </span>
        <h2 className="mt-4 text-5xl font-bold text-yellow-400 drop-shadow-lg">
          {slide.titulo}
        </h2>
        <p className="text-gray-200 mt-2 text-lg">{slide.descripcion}</p>
      </motion.div>

      {/* Flechas */}
      <div
        className="absolute left-6 top-1/2 -translate-y-1/2 cursor-pointer text-yellow-400 hover:text-yellow-300 text-5xl transition"
        onClick={prevSlide}
      >
        <i className="bi bi-chevron-left drop-shadow-[0_0_10px_rgba(255,255,0,0.6)]"></i>
      </div>
      <div
        className="absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer text-yellow-400 hover:text-yellow-300 text-5xl transition"
        onClick={nextSlide}
      >
        <i className="bi bi-chevron-right drop-shadow-[0_0_10px_rgba(255,255,0,0.6)]"></i>
      </div>
    </section>
  );
}
