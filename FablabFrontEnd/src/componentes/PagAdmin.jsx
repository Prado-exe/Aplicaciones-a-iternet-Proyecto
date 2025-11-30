import React, { useState } from "react";
import CrearEvento from "./CrearEvento.jsx";
import ListarUsuarios from "./ListarUsuarios.jsx";
import UsuarioDetalle from "./usuarioDetalle.jsx";
import ConfiguracionIndex from "./ConfiguracionIndex.jsx";



export default function PagAdmin() {
  const [seccionActiva, setSeccionActiva] = useState("carrusel");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const renderContenido = () => {
    if (seccionActiva === "listar-usuarios") {
      if (usuarioSeleccionado) {
        return (
          <UsuarioDetalle
            userId={usuarioSeleccionado}
            onVolver={() => setUsuarioSeleccionado(null)}
          />
        );
      }

      return (
        <ListarUsuarios
          onSeleccionarUsuario={(user) => setUsuarioSeleccionado(user)}
        />
      );
    }

    switch (seccionActiva) {

      case "config-general":
        return <ConfiguracionIndex />;
      /*case "carrusel": // ✅ Nueva sección
        return <AdminCarrusel />;
      case "talleres-modif":
        return <AdminTalleres />;
      case "Eventos-modif":
        return <AdminEventos />;*/
      case "reservas":
        return <p className="opacity-90">Panel para gestionar las reservas de máquinas o espacios.</p>;
      case "eventos":
        return <CrearEvento />;
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
            {[
              { id: "config-general", label: "Configuración index" },
              /*{ id: "carrusel", label: "Configurar Carrusel" }, // ✅ Nuevo botón
              { id: "talleres-modif", label: "config talleres" },
              { id: "Eventos-modif", label: "config Eventos" },*/
              { id: "reservas", label: "Reservas" },
              { id: "listar-usuarios", label: "Ver Usuarios" },
              { id: "eventos", label: "Eventos" },
            ].map((item) => (
              <li key={item.id}>
                <button
                  className={`w-full text-left p-3 rounded-xl transition 
                  ${seccionActiva === item.id ? "bg-yellow-600 text-black" : "bg-[#1b1b1f]"}`}
                  onClick={() => {
                    setSeccionActiva(item.id);
                    setUsuarioSeleccionado(null);
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* PANEL DERECHO */}
        <div className="w-2/3 bg-[#0f0f13] p-6 rounded-2xl border border-yellow-500/20">
          <h2 className="text-xl font-bold mb-4 capitalize">
            {seccionActiva.replace("-", " ")}
          </h2>

          <div className="min-h-[300px] px-4 py-2">
            {renderContenido()}
          </div>

        </div>

      </div>
    </div>
  );
}
