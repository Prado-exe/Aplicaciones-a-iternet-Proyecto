import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import imgRobotica from "../assets/Robotica.jpg";
import imgUnity from "../assets/unity2.webp";
import imgArduino from "../assets/arduino.jpg";
import imgGamelab from "../assets/jam.png";
import UniqueDivider from "./UniqueDivider";

export default function PagNoticiero() {
  const tabs = [
    { id: "todo", label: "Todo" },
    { id: "avisos", label: "Avisos" },
    { id: "eventos", label: "Eventos" },
  ];

  const avisos = [
    {
      id: 1,
      categoria: "avisos",
      tipo: "Avisos",
      titulo: "Un acercamiento a la robótica",
      fecha: "Enero",
      imagen: imgRobotica,
    },
    {
      id: 2,
      categoria: "avisos",
      tipo: "Aviso",
      titulo: "Taller Unity 2D",
      fecha: "Febrero",
      imagen: imgUnity,
    },
    {
      id: 3,
      categoria: "avisos",
      tipo: "Aviso",
      titulo: "Taller Arduino avanzado",
      fecha: "1250-2090",
      imagen: imgArduino,
    },
    {
      id: 4,
      categoria: "eventos",
      tipo: "Eventos",
      titulo: "Presentaciones Gamelab",
      fecha: "Mañana",
      imagen: imgGamelab,
    },
  ];

  const [activeTab, setActiveTab] = useState("todo");

  const avisosFiltrados =
    activeTab === "todo"
      ? avisos
      : avisos.filter((aviso) => aviso.categoria === activeTab);

  // 🔹 Control de animaciones (solo una vez por card)
  useEffect(() => {
    const cards = document.querySelectorAll(".fade-card");

    cards.forEach((card) => {
      card.classList.remove("show"); // Resetea para nuevo render
      setTimeout(() => {
        card.classList.add("show");
      }, 100); // pequeña espera para que entre la animación
    });
  }, [activeTab]); // se ejecuta cuando cambias de pestaña

  return (
    <>
      <Navbar />

      <main className="pt-24 bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f] text-gray-200 min-h-screen">
        {/* Encabezado */}
        <header className="text-center py-16 px-4">
          <h1 className="text-5xl font-extrabold text-yellow-400 mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
            Avisos y Actualizaciones
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Entérate de las últimas novedades y eventos del FABLAB
          </p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300
                ${
                  activeTab === tab.id
                    ? "bg-yellow-500 text-black shadow-lg scale-105"
                    : "bg-transparent border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/20"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="max-w-6xl mx-auto flex flex-col gap-20 px-6 pb-24">
          {avisosFiltrados.length === 0 ? (
            <p className="text-center text-gray-400 italic">
              No hay avisos en esta categoría.
            </p>
          ) : (
            avisosFiltrados.map((aviso, i) => (
              <section
                key={aviso.id}
                className={`fade-card opacity-0 transform ${
                  i % 2 ? "translate-x-20 md:flex-row-reverse" : "-translate-x-20"
                } flex flex-col md:flex-row items-center gap-10 transition-all duration-[1200ms] ease-out
                bg-[#0e0e12]/90 border border-yellow-500/10 rounded-2xl shadow-[0_0_25px_rgba(255,215,0,0.1)] p-6`}
              >
                {/* Texto */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-yellow-400 mb-2 drop-shadow-[0_0_10px_rgba(255,215,0,0.4)]">
                    {aviso.titulo}
                  </h2>
                  <p className="text-gray-400 mb-1 font-semibold">
                    {aviso.tipo}
                  </p>
                  <p className="text-gray-500 mb-4">{aviso.fecha}</p>
                </div>

                {/* Imagen */}
                <figure className="flex-1 flex justify-center">
                  <img
                    src={aviso.imagen}
                    alt={aviso.titulo}
                    loading="lazy"
                    className="rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.15)] hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] transition-all duration-500"
                  />
                </figure>
              </section>
            ))
          )}

          <UniqueDivider />
        </div>
      </main>

      {/* Animación */}
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
