import React, { useState } from "react";
import Navbar from "./Navbar";
import "../styles/PagNoticiero.css";

import imgRobotica from "../assets/Robotica.jpg";
import imgUnity from "../assets/unity2.webp";
import imgArduino from "../assets/arduino.jpg";
import imgGamelab from "../assets/jam.png";

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
      imagen: imgRobotica
    },
    {
      id: 2,
      categoria: "avisos",
      tipo: "Aviso",
      titulo: "Taller Unity 2D",
      fecha: "Febrero",
      imagen: imgUnity
    },
    {
      id: 3,
      categoria: "avisos",
      tipo: "Aviso",
      titulo: "Taller Arduino avanzado",
      fecha: "1250-2090",
      descripcion: " ",
      imagen: imgArduino
    },
    {
      id: 4,
      categoria: "eventos",
      tipo: "Eventos",
      titulo: "Presentaciones Gamelab",
      fecha: "Mañana",
      imagen: imgGamelab
    }
  ];

  const [activeTab, setActiveTab] = useState("todo");

  const avisosFiltrados =
    activeTab === "todo"
      ? avisos
      : avisos.filter((aviso) => aviso.categoria === activeTab);

  return (
    <>
      <Navbar />

      <main className="noticiero">
        <header className="noticiero-header">
          <h1>Avisos y Actualizaciones</h1>
          <p>Entérate de las últimas novedades y eventos del FABLAB</p>
        </header>

        <div className="noticiero-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? "active" : ""}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="noticiero-grid">
          {avisosFiltrados.length === 0 ? (
            <p className="no-avisos">No hay avisos en esta categoría.</p>
          ) : (
            avisosFiltrados.map((aviso, i) => (
              <section key={aviso.id} className={`noticiero-row ${i % 2 ? "invert" : ""}`}>
                <div className="noticiero-info">
                  <h2>{aviso.titulo}</h2>
                  <p className="tipo">{aviso.tipo}</p>
                  <p className="fecha">{aviso.fecha}</p>
                  {aviso.descripcion && <p>{aviso.descripcion}</p>}
                </div>
                <figure className="noticiero-media">
                  <img src={aviso.imagen} alt={aviso.titulo} loading="lazy" />
                </figure>
              </section>
            ))
          )}
        </div>
      </main>
    </>
  );
}
