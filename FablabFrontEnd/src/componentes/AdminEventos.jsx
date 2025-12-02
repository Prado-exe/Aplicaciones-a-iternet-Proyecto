import React, { useEffect, useState } from "react";

export default function AdminEventos() {
  const [eventos, setEventos] = useState([]);
  const [config, setConfig] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // ⭐ Nuevo: paginación
  const eventosPorPagina = 5;
  const [paginaActual, setPaginaActual] = useState(1);

  // ⭐ Nuevo: filtros
  const [filtro, setFiltro] = useState("todos"); 
  // valores: todos | futuros | pasados

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eRes, cfgRes] = await Promise.all([
          fetch("http://localhost:5000/api/eventos"),
          fetch("http://localhost:5000/api/eventos/config")
        ]);

        if (!eRes.ok) throw new Error(`Error eventos: ${eRes.status}`);
        if (!cfgRes.ok) throw new Error(`Error config: ${cfgRes.status}`);

        const e = await eRes.json();
        const cfg = await cfgRes.json();

        // Solo eventos (TipoEvento === 2)
        const soloEventos = Array.isArray(e)
          ? e.filter(ev => ev.TipoEvento === 2)
          : [];

        // Orden descendente por fecha
        const ordenados = [...soloEventos].sort(
          (a, b) => new Date(b.FechaEvento) - new Date(a.FechaEvento)
        );

        setEventos(ordenados);
        setConfig(cfg.config || { cantidadMostrar: 0 });
        setSeleccionados(cfg.config?.eventos_mostrados || []);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, []);

  const toggleSeleccion = (id) => {
    setSeleccionados(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const guardar = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/eventos/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventos_mostrados: seleccionados,
          cantidadMostrar: seleccionados.length
        })
      });

      if (!res.ok) throw new Error("Error al guardar la configuración");
      alert("Configuración guardada");
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar la configuración");
    }
  };

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  // ⭐ FILTRO POR FECHA
  const hoy = new Date();

  const eventosFiltrados = eventos.filter(ev => {
    const fecha = new Date(ev.FechaEvento);

    if (filtro === "futuros") return fecha >= hoy;
    if (filtro === "pasados") return fecha < hoy;

    return true; // todos
  });

  // ⭐ PAGINACIÓN
  const indexInicio = (paginaActual - 1) * eventosPorPagina;
  const indexFin = indexInicio + eventosPorPagina;
  const eventosPagina = eventosFiltrados.slice(indexInicio, indexFin);

  const totalPaginas = Math.ceil(eventosFiltrados.length / eventosPorPagina);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">
        Configurar Eventos
      </h2>

      {/* ⭐ BOTONES DE FILTRO */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => { setFiltro("todos"); setPaginaActual(1); }}
          className={`px-4 py-2 rounded-lg font-semibold 
            ${filtro === "todos" ? "bg-yellow-500 text-black" : "bg-gray-700 text-white"}`}
        >
          Todos
        </button>

        <button
          onClick={() => { setFiltro("futuros"); setPaginaActual(1); }}
          className={`px-4 py-2 rounded-lg font-semibold 
            ${filtro === "futuros" ? "bg-yellow-500 text-black" : "bg-gray-700 text-white"}`}
        >
          Futuros
        </button>

        <button
          onClick={() => { setFiltro("pasados"); setPaginaActual(1); }}
          className={`px-4 py-2 rounded-lg font-semibold 
            ${filtro === "pasados" ? "bg-yellow-500 text-black" : "bg-gray-700 text-white"}`}
        >
          Pasados
        </button>
      </div>

      {/* ⭐ LISTADO DE EVENTOS */}
      {eventosPagina.map(e => (
        <div
          key={e._id}
          className={`flex items-start bg-[#1b1b1f] border rounded-xl p-4 shadow-md hover:shadow-lg transition
            ${seleccionados.includes(e._id) ? "border-yellow-400" : "border-yellow-500/20"}`}
        >
          {/* Imagen */}
          <img
            src={e.imagen?.url}
            alt={e.NombreEvento}
            className="w-24 h-24 object-cover rounded-lg mr-4 flex-shrink-0"
          />

          <div className="flex-1">
            <h3 className="text-lg font-bold text-yellow-300">{e.NombreEvento}</h3>
            <p className="text-gray-400 text-sm mb-1">Evento</p>
            <p className="text-gray-500 text-sm mb-1">
              Fecha: {new Date(e.FechaEvento).toLocaleDateString()}
            </p>
            <p className="text-gray-300 text-sm line-clamp-3">
              {e.DescripcionEvento}
            </p>
          </div>

          <div className="ml-4 mt-2">
            <input
              type="checkbox"
              checked={seleccionados.includes(e._id)}
              onChange={() => toggleSeleccion(e._id)}
              className="form-checkbox h-5 w-5 text-yellow-500 rounded"
            />
          </div>
        </div>
      ))}

      {/* ⭐ PAGINACIÓN */}
      <div className="flex justify-center space-x-3 mt-4">
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            onClick={() => setPaginaActual(i + 1)}
            className={`px-3 py-1 rounded-md font-bold 
              ${paginaActual === i + 1
                ? "bg-yellow-500 text-black"
                : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        onClick={guardar}
        className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-full transition"
      >
        Guardar Configuración
      </button>
    </div>
  );
}
