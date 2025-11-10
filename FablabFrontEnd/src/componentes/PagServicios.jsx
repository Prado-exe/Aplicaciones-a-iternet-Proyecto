import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import UniqueDivider from "./UniqueDivider";

export default function PagServicios() {
  const bloques = [
    {
      id: "laser",
      titulo: "Cortadora Láser",
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
      id: "vr-ar",
      titulo: "Realidad Virtual (VR-AR)",
      desc: `Área dedicada a experiencias inmersivas para pruebas de proyectos interactivos,
      simulaciones, visualización de modelos 3D y demostraciones educativas. Incluye equipos de
      última generación y un espacio seguro para la exploración de entornos virtuales o
      aumentados.`,
      img: "https://userena.cl/images/imagenes_articulos/uls_noticias/2023/junio/nota_junio_19_1_1.jpg",
    },
  ];

  // 🔸 Efecto de aparición al hacer scroll
  useEffect(() => {
    const cards = document.querySelectorAll(".fade-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.2 }
    );
    cards.forEach((card) => observer.observe(card));
  }, []);

  return (
    <>
      <Navbar />

      {/* 🔹 Fondo y margen superior */}
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
            <section
              key={b.id}
              className={`fade-card opacity-0 transform ${
                i % 2 ? "translate-x-20 md:flex-row-reverse" : "-translate-x-20"
              } flex flex-col md:flex-row items-center gap-10 transition-all duration-[1200ms] ease-out
              bg-[#0e0e12]/90 border border-yellow-500/10 rounded-2xl shadow-[0_0_25px_rgba(255,215,0,0.1)] p-6`}
            >
              {/* Texto */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-yellow-400 mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.4)]">
                  {b.titulo}
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">{b.desc}</p>
                <Link
                  to={`/reserva/${b.id}`}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Reservar una hora
                </Link>
              </div>

              {/* Imagen */}
              <figure className="flex-1 flex justify-center">
                <img
                  src={b.img}
                  alt={b.titulo}
                  loading="lazy"
                  className="rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.15)] hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] transition-all duration-500"
                />
              </figure>
            </section>
          ))}

          <UniqueDivider />

          <p className="text-gray-400 text-center italic">
            “El conocimiento y la creatividad son los motores de la innovación.”
          </p>
        </div>
      </main>

      {/* 🔹 Animaciones personalizadas */}
      <style>
        {`
          .fade-card.show {
            opacity: 1 !important;
            transform: translateX(0) !important;
          }
        `}
      </style>
    </>
  );
}
