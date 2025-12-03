import React, { useState } from "react";
import CrearEvento from "./CrearEvento.jsx";
import ListarUsuarios from "./ListarUsuarios.jsx";
import UsuarioDetalle from "./usuarioDetalle.jsx";
import ConfiguracionIndex from "./ConfiguracionIndex.jsx";
import AdminSolicitudes from "./AdminSolicitudes.jsx";
import AdminParticipantes from "./AdminParticipantes.jsx";

export default function PagAdmin() {
  const [seccionActiva, setSeccionActiva] = useState("carrusel");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  // Nuevo estado para controlar si el menú está abierto en móvil
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const renderContenido = () => {
    // ... (El contenido de la función renderContenido queda igual)
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
      case "participantes-eventos":
        return <AdminParticipantes />;
      case "solicitudes":
        return <AdminSolicitudes />;
      case "reservas":
        return <p className="opacity-90">Panel para gestionar las reservas de máquinas o espacios.</p>;
      case "eventos":
        return <CrearEvento />;
      default:
        return <p className="opacity-90">Seleccione una sección del panel izquierdo.</p>;
    }
  };

  const menuItems = [
      { id: "config-general", label: "Configuración index" },
      { id: "participantes-eventos", label: "Participantes de Eventos" },
      { id: "solicitudes", label: "Solicitudes" },
      { id: "listar-usuarios", label: "Ver Usuarios" },
      { id: "eventos", label: "Eventos" },
  ];

  const handleMenuItemClick = (id) => {
    setSeccionActiva(id);
    setUsuarioSeleccionado(null);
    // Cierra el menú en móvil después de seleccionar una opción
    setIsMenuOpen(false); 
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-yellow-200 pt-28 pb-12 flex justify-center">
      <div className="w-full max-w-7xl bg-[#1b1b1f] rounded-3xl p-4 sm:p-8 shadow-lg border border-yellow-500/40">
        
        {/* Contenedor Principal: 1 columna en móvil, 2 columnas en LG */}
        <div className="flex flex-col lg:flex-row gap-6">

            {/* BOTÓN DEL MENÚ (Visible solo en móvil) */}
            <div className="lg:hidden mb-4">
                <button
                    className="w-full bg-yellow-600 text-black p-3 rounded-xl font-bold transition hover:bg-yellow-500"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? "Ocultar Menú" : "Mostrar Menú de Navegación"}
                </button>
            </div>


            {/* PANEL IZQUIERDO (Menú de Navegación) */}
            {/* Oculto por defecto en móvil a menos que isMenuOpen sea true */}
            <div className={`
                w-full lg:w-1/3 bg-[#0f0f13] p-6 rounded-2xl border border-yellow-500/20 
                ${isMenuOpen ? 'block' : 'hidden'} lg:block
            `}>
                <h2 className="text-xl font-bold mb-4">Secciones del Panel</h2>

                <ul className="space-y-3">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                className={`w-full text-left p-3 rounded-xl transition 
                                ${seccionActiva === item.id ? "bg-yellow-600 text-black font-semibold" : "bg-[#1b1b1f] hover:bg-yellow-800/20"}`}
                                onClick={() => handleMenuItemClick(item.id)}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* PANEL DERECHO (Contenido Principal) */}
            {/* Ocupa todo el ancho en móvil, 2/3 en LG */}
            <div className="w-full lg:w-2/3 bg-[#0f0f13] p-6 rounded-2xl border border-yellow-500/20">
                <h2 className="text-xl font-bold mb-4 capitalize">
                    {/* Muestra el nombre de la sección activa o el título de UsuarioDetalle */}
                    {usuarioSeleccionado ? "Detalles de Usuario" : seccionActiva.replace("-", " ")}
                </h2>

                <div className="min-h-[300px] px-4 py-2">
                    {renderContenido()}
                </div>

            </div>

        </div>
      </div>
    </div>
  );
}