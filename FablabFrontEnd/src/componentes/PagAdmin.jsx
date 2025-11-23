import React, { useState } from "react";
import CrearEvento from "./CrearEvento.jsx";
import ListarUsuarios from "./ListarUsuarios.jsx";

export default function PagAdmin() {
  const [seccionActiva, setSeccionActiva] = useState("carrusel");

  const renderContenido = () => {
    switch (seccionActiva) {
      case "carrusel":
        return <p className="opacity-90">Aquí puedes editar imágenes, títulos y textos del carrusel principal.</p>;

      case "cursos":
        return <p className="opacity-90">Gestión de cursos: crear, editar, ocultar o eliminar cursos publicados.</p>;

      case "proyectos":
        return <p className="opacity-90">Administración de proyectos relevantes o destacados del FabLab.</p>;

      case "reservas":
        return <p className="opacity-90">Panel para gestionar las reservas de máquinas o espacios.</p>;

      case "usuarios":
        return <p className="opacity-90">Administración de usuarios: roles, permisos, bloqueos, etc.</p>;

      case "eventos":
        return <CrearEvento />;

      case "listar-usuarios":
        return <ListarUsuarios />;

      default:
        return <p className="opacity-90">Seleccione una sección del panel izquierdo.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-yellow-200 pt-28 pb-12 flex justify-center">
      <div className="w-full max-w-7xl bg-[#1b1b1f] rounded-3xl p-8 shadow-lg border border-yellow-500/40 flex gap-6">

        {/* PANEL IZQUIERDO */}
        <div className="w-1/3 bg-[#0f0f13] p-6 rounded-2xl border border-yellow-500/20">
          <h2 className="text-xl font-bold mb-4">Secciones del Panel</h2>

          <ul className="space-y-3">
            <li>
              <button
                className={`w-full text-left p-3 rounded-xl transition 
                ${seccionActiva === "carrusel" ? "bg-yellow-600 text-black" : "bg-[#1b1b1f]"}`}
                onClick={() => setSeccionActiva("carrusel")}
              >
                Carrusel Principal
              </button>
            </li>

            <li>
              <button
                className={`w-full text-left p-3 rounded-xl transition 
                ${seccionActiva === "cursos" ? "bg-yellow-600 text-black" : "bg-[#1b1b1f]"}`}
                onClick={() => setSeccionActiva("cursos")}
              >
                Gestión de Cursos
              </button>
            </li>

            <li>
              <button
                className={`w-full text-left p-3 rounded-xl transition 
                ${seccionActiva === "proyectos" ? "bg-yellow-600 text-black" : "bg-[#1b1b1f]"}`}
                onClick={() => setSeccionActiva("proyectos")}
              >
                Proyectos Relevantes
              </button>
            </li>

            <li>
              <button
                className={`w-full text-left p-3 rounded-xl transition 
                ${seccionActiva === "reservas" ? "bg-yellow-600 text-black" : "bg-[#1b1b1f]"}`}
                onClick={() => setSeccionActiva("reservas")}
              >
                Reservas
              </button>
            </li>

            <li>
              <button
                className={`w-full text-left p-3 rounded-xl transition 
                ${seccionActiva === "listar-usuarios" ? "bg-yellow-600 text-black" : "bg-[#1b1b1f]"}`}
                onClick={() => setSeccionActiva("listar-usuarios")}
              >
                Ver Usuarios
              </button>
            </li>


            <li>
              <button
                className={`w-full text-left p-3 rounded-xl transition 
                ${seccionActiva === "eventos" ? "bg-yellow-600 text-black" : "bg-[#1b1b1f]"}`}
                onClick={() => setSeccionActiva("eventos")}
              >
                Eventos
              </button>
            </li>
          </ul>
        </div>

        {/* PANEL DERECHO */}
        <div className="w-2/3 bg-[#0f0f13] p-6 rounded-2xl border border-yellow-500/20">
          <h2 className="text-xl font-bold mb-4 capitalize">
            {seccionActiva.replace("-", " ")}
          </h2>

          <div className="bg-[#1b1b1f] p-6 rounded-xl border border-yellow-500/10 min-h-[300px]">
            {renderContenido()}
          </div>
        </div>

      </div>
    </div>
  );
}
