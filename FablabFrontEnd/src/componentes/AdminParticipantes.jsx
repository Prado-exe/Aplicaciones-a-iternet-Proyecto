import React, { useEffect, useState } from "react";

export default function AdminParticipantes() {
  const [eventos, setEventos] = useState([]);
  const [filtro, setFiltro] = useState("todos"); // todos | encurso | pasados
  const [cargando, setCargando] = useState(true);
  const [modalEvento, setModalEvento] = useState(null);

  const fetchEventos = async () => {
    setCargando(true);
    let url = "/api/admin/participantes";

    if (filtro === "encurso") url += "/encurso";
    else if (filtro === "pasados") url += "/pasados"; // opcional si lo agregas luego

    try {
      const res = await fetch(url);
      const data = await res.json();
      setEventos(data);
    } catch (err) {
      console.error("Error al cargar eventos:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, [filtro]);

  const abrirModal = async (id) => {
    try {
      const res = await fetch(`/api/admin/participantes/${id}`);
      const data = await res.json();
      setModalEvento(data);
    } catch (err) {
      console.error("Error al obtener detalle:", err);
    }
  };

  const cerrarModal = () => setModalEvento(null);

  if (cargando) return <p className="p-4">Cargando...</p>;

  return (
    <div className="p-4 space-y-6 text-white">
      
      {/* Filtros */}
      <div className="flex gap-4">
        <button
          onClick={() => setFiltro("todos")}
          className={`px-4 py-2 rounded ${filtro === "todos" ? "bg-yellow-500 text-black" : "bg-[#1a1a1f]"}`}
        >
          Todos
        </button>

        <button
          onClick={() => setFiltro("encurso")}
          className={`px-4 py-2 rounded ${filtro === "encurso" ? "bg-yellow-500 text-black" : "bg-[#1a1a1f]"}`}
        >
          En curso
        </button>

        <button
          onClick={() => setFiltro("pasados")}
          className={`px-4 py-2 rounded ${filtro === "pasados" ? "bg-yellow-500 text-black" : "bg-[#1a1a1f]"}`}
        >
          Pasados
        </button>
      </div>

      {/* Lista de eventos */}
      <div className="space-y-4">
        {eventos.length === 0 ? (
          <p>No hay eventos disponibles.</p>
        ) : (
          eventos.map((e) => (
            <div
              key={e._id}
              className="p-4 rounded-xl bg-[#0f0f13] border border-yellow-500/20 flex justify-between"
            >
              <div>
                <p><b>Nombre:</b> {e.NombreEvento}</p>
                <p><b>Fecha:</b> {new Date(e.FechaEvento).toLocaleString()}</p>
                <p><b>Inscritos:</b> {e.CuposEventos.IDR_Inscritos.length} / {e.CuposEventos.CantidadCupos}</p>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => abrirModal(e._id)}
                  className="px-4 py-2 bg-yellow-500 text-black rounded hover:scale-105 transition"
                >
                  Ver participantes
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de participantes */}
      {modalEvento && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-[#1d1d22] p-6 rounded-xl w-full max-w-lg border border-yellow-500/20">
            
            <h2 className="text-xl font-bold mb-4">
              Participantes — {modalEvento.NombreEvento}
            </h2>

            <p className="mb-2">
              <b>Fecha:</b> {new Date(modalEvento.FechaEvento).toLocaleString()}
            </p>

            <p className="mb-2">
              <b>Cupos:</b> {modalEvento.CuposEventos.IDR_Inscritos.length} / {modalEvento.CuposEventos.CantidadCupos}
            </p>

            <hr className="my-4 border-yellow-500/20" />

            <div className="max-h-64 overflow-y-auto space-y-2">
              {modalEvento.CuposEventos.IDR_Inscritos.length === 0 ? (
                <p className="text-gray-400">No hay inscritos.</p>
              ) : (
                modalEvento.CuposEventos.IDR_Inscritos.map((u) => (
                  <div
                    key={u._id}
                    className="p-2 bg-[#0f0f13] rounded border border-yellow-500/20"
                  >
                    <p><b>Nickname:</b> {u.Nickname}</p>
                    <p><b>Nombre:</b> {u.NombreUsuario}</p>
                    <p><b>Correo:</b> {u.CorreoUsuario}</p>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={cerrarModal}
              className="mt-4 px-4 py-2 w-full bg-red-500 text-black rounded hover:scale-105 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
