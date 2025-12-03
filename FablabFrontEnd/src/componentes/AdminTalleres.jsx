import React, { useEffect, useState } from "react";

export default function AdminTalleres() {
  const [talleres, setTalleres] = useState([]);
  const [config, setConfig] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // ⭐ Paginación
  const talleresPorPagina = 3;
  const [paginaActual, setPaginaActual] = useState(1);

  // ⭐ Filtro: todos | futuros | pasados
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tRes, cfgRes] = await Promise.all([
          fetch("/api/eventos"),
          fetch("/api/talleres/config")
        ]);

        if (!tRes.ok) throw new Error(`Error talleres: ${tRes.status}`);
        if (!cfgRes.ok) throw new Error(`Error config: ${cfgRes.status}`);

        const t = await tRes.json();
        const cfg = await cfgRes.json();

        // Filtrar solo talleres (TipoEvento === 1)
        const soloTalleres = Array.isArray(t)
          ? t.filter(ev => ev.TipoEvento === 1)
          : [];

        // ⭐ CAMBIO: ÚLTIMO CREADO PRIMERO (por _id más reciente) - NO por fecha
        const ordenados = [...soloTalleres].sort((a, b) => b._id.localeCompare(a._id));

        setTalleres(ordenados);
        setConfig(cfg.config || { cantidadMostrar: 0 });
        setSeleccionados(cfg.config?.talleres_mostrados || []);
      } catch (err) {
        console.error("Error cargando talleres o configuración:", err);
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
      const res = await fetch("/api/talleres/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          talleres_mostrados: seleccionados,
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

  // ⭐ APLICAR FILTRO
  const hoy = new Date();
  const talleresFiltrados = talleres.filter(t => {
    const fecha = new Date(t.FechaEvento);

    if (filtro === "futuros") return fecha >= hoy;
    if (filtro === "pasados") return fecha < hoy;

    return true; // todos
  });

  // ⭐ PAGINACIÓN
  const indexInicio = (paginaActual - 1) * talleresPorPagina;
  const indexFin = indexInicio + talleresPorPagina;
  const talleresPagina = talleresFiltrados.slice(indexInicio, indexFin);

  const totalPaginas = Math.ceil(talleresFiltrados.length / talleresPorPagina);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">
        Configurar Talleres
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

      {/* ⭐ LISTADO DE TALLERES */}
      {talleresPagina.map(t => (
        <div
          key={t._id}
          className={`flex items-start bg-[#1b1b1f] border rounded-xl p-4 shadow-md hover:shadow-lg transition
            ${seleccionados.includes(t._id) ? "border-yellow-400" : "border-yellow-500/20"}`}
        >
          {/* Imagen */}
          <img
            src={t.imagen?.url}
            alt={t.NombreEvento}
            className="w-24 h-24 object-cover rounded-lg mr-4 flex-shrink-0"
          />

          {/* Datos */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-yellow-300">{t.NombreEvento}</h3>
            <p className="text-gray-400 text-sm mb-1">Taller</p>
            <p className="text-gray-500 text-sm mb-1">
              Fecha: {new Date(t.FechaEvento).toLocaleDateString()}
            </p>
            <p className="text-gray-300 text-sm line-clamp-3">
              {t.DescripcionEvento}
            </p>
          </div>

          {/* Checkbox */}
          <input
            type="checkbox"
            checked={seleccionados.includes(t._id)}
            onChange={() => toggleSeleccion(t._id)}
            className="form-checkbox h-5 w-5 text-yellow-500 rounded ml-4 mt-2"
          />
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
