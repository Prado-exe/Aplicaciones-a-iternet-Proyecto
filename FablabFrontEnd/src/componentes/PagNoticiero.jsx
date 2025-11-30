import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footbar";
import UniqueDivider from "./UniqueDivider";

export default function PagNoticiero() {
  const tabs = [
    { id: "todo", label: "Todo" },
    { id: "avisos", label: "Avisos" },
    { id: "eventos", label: "Eventos" },
  ];

  const [activeTab, setActiveTab] = useState("todo");
  const [eventos, setEventos] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState(null);

  const userId = localStorage.getItem("userId"); // suponer que guardas el id del usuario

  useEffect(() => {
    fetch("http://localhost:5000/api/eventos")
      .then((res) => res.json())
      .then((data) => setEventos(data));
  }, []);

  const eventosFiltrados =
    activeTab === "todo"
      ? eventos
      : eventos.filter((e) =>
          activeTab === "eventos" ? e.TipoEvento === 2 : e.TipoEvento === 1
        );

  useEffect(() => {
    const cards = document.querySelectorAll(".fade-card");
    cards.forEach((card) => {
      card.classList.remove("show");
      setTimeout(() => card.classList.add("show"), 100);
    });
  }, [activeTab, eventos]);

  return (
    <>
      <Navbar />

      <main className="pt-24 bg-[#0b0b0f] text-gray-200 min-h-screen">
        <header className="text-center py-16 px-4">
          <h1 className="text-5xl font-extrabold text-yellow-400 mb-4">
            Avisos y Actualizaciones
          </h1>
          <p className="text-gray-300">Novedades y eventos del FABLAB</p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full font-semibold ${
                activeTab === tab.id
                  ? "bg-yellow-500 text-black scale-105"
                  : "border border-yellow-500 text-yellow-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="max-w-6xl mx-auto flex flex-col gap-20 px-6 pb-24">
          {eventosFiltrados.map((ev, i) => (
            <section
              key={ev._id}
              onClick={() => setSelectedEvento(ev)}
              className={`fade-card opacity-0 cursor-pointer transform ${
                i % 2 ? "translate-x-20 md:flex-row-reverse" : "-translate-x-20"
              } flex flex-col md:flex-row items-center gap-10 p-6 bg-[#0e0e12]/90 border border-yellow-500/10 rounded-2xl`}
            >
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">
                  {ev.NombreEvento}
                </h2>
                <p className="text-gray-400 font-semibold">
                  {ev.TipoEvento === 2 ? "Evento" : "Aviso"}
                </p>
                <p className="text-gray-500">
                  {new Date(ev.FechaEvento).toLocaleDateString()}
                </p>
              </div>

              <figure className="flex-1 flex justify-center">
                <img
                  src={ev.RutaImagenEvento}
                  alt={ev.NombreEvento}
                  className="rounded-xl shadow-lg w-48 h-48 object-cover"
                />
              </figure>

            </section>
          ))}

          <UniqueDivider />
        </div>
      </main>

      <Footer />

      {/* MODAL DE DETALLE */}
      {selectedEvento && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvento(null)}
        >
          <div
            className="bg-[#111] border border-yellow-500/20 rounded-2xl p-8 max-w-xl w-full text-white relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEvento(null)}
              className="absolute top-3 right-3 text-yellow-400 text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-yellow-400 mb-4">
              {selectedEvento.NombreEvento}
            </h2>

            <img
              src={selectedEvento.RutaImagenEvento}
              alt="Evento"
              className="rounded-xl mb-4 shadow-lg"
            />

            <p className="text-gray-400 mb-2">
              {selectedEvento.TipoEvento === 2 ? "Evento" : "Aviso"}
            </p>

            <p className="text-gray-500 mb-4">
              Fecha: {new Date(selectedEvento.FechaEvento).toLocaleDateString()}
            </p>

            <p className="text-gray-300 mb-6">{selectedEvento.DescripcionEvento}</p>

            <p className="mb-4 text-yellow-400 font-semibold">
              Inscritos: {selectedEvento.CuposEventos.IDR_Inscritos.length} / {selectedEvento.CuposEventos.CantidadCupos} 
              ({selectedEvento.CuposEventos.CuposDisponibles} cupos disponibles)
            </p>

            <button
              disabled={
                selectedEvento.CuposEventos.IDR_Inscritos.includes(userId) || 
                selectedEvento.CuposEventos.CuposDisponibles <= 0
              }
              onClick={async () => {
                // ⚡️ Prevenir acción si ya está inscrito
                if (selectedEvento.CuposEventos.IDR_Inscritos.includes(userId)) {
                  alert("Ya estás registrado en este evento");
                  return;
                }

                const token = localStorage.getItem("token");
                if (!token) {
                  alert("Debes iniciar sesión para inscribirte.");
                  return;
                }

                try {
                  const res = await fetch(
                    `http://localhost:5000/api/eventos/${selectedEvento._id}/inscribir`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  const data = await res.json();

                  if (!res.ok) {
                    alert(data.error || "No se pudo inscribir");
                    return;
                  }

                  alert("¡Inscrito correctamente!");
                  setSelectedEvento(data);
                  setEventos((prev) =>
                    prev.map((e) => (e._id === data._id ? data : e))
                  );

                } catch (err) {
                  console.error(err);
                  alert("Error al inscribirse");
                }
              }}
              className={`px-6 py-2 rounded-full font-semibold ${
                selectedEvento.CuposEventos.IDR_Inscritos.includes(userId) || 
                selectedEvento.CuposEventos.CuposDisponibles <= 0
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-yellow-500 text-black hover:scale-105"
              }`}
            >
              {selectedEvento.CuposEventos.IDR_Inscritos.includes(userId)
                ? "Ya inscrito"
                : selectedEvento.CuposEventos.CuposDisponibles <= 0
                ? "No hay cupos"
                : "Inscribirme"}
            </button>

          </div>
        </div>
      )}

      <style>
        {`
          .fade-card.show {
            opacity: 1 !important;
            transform: translateX(0) !important;
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </>
  );
}
