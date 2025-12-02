import React, { useEffect, useState } from "react";

export default function AdminCarrusel() {
  const [eventos, setEventos] = useState([]);
  const [config, setConfig] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evRes, cfgRes] = await Promise.all([
          fetch("http://localhost:5000/api/eventos"),
          fetch("http://localhost:5000/api/carrusel/config")
        ]);

        if (!evRes.ok) throw new Error(`Error eventos: ${evRes.status}`);
        if (!cfgRes.ok) throw new Error(`Error config: ${cfgRes.status}`);

        const ev = await evRes.json();
        const cfg = await cfgRes.json();

        setEventos(Array.isArray(ev) ? ev : []);
        setConfig(cfg.config || { cantidadMostrar: 0 });
        setSeleccionados(cfg.config?.eventos_mostrados || []);
      } catch (err) {
        console.error("Error cargando eventos o configuración:", err);
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
      const res = await fetch("http://localhost:5000/api/carrusel/config", {
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">
        Configurar Carrusel
      </h2>

      {Array.isArray(eventos) && eventos.map(e => (
        <div
          key={e._id}
          className={`flex items-start bg-[#1b1b1f] border rounded-xl p-4 shadow-md hover:shadow-lg transition
            ${seleccionados.includes(e._id) ? "border-yellow-400" : "border-yellow-500/20"}`}
        >
          {/* Imagen a la izquierda */}
          <img
            src={e.imagen?.url}
            alt={e.NombreEvento}
            className="w-24 h-24 object-cover rounded-lg mr-4 flex-shrink-0"
          />


          {/* Datos del evento */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-yellow-300">{e.NombreEvento}</h3>
            <p className="text-gray-400 text-sm mb-1">
              {e.TipoEvento === 2 ? "Evento" : "Taller"}
            </p>
            <p className="text-gray-500 text-sm mb-1">
              Fecha: {new Date(e.FechaEvento).toLocaleDateString()}
            </p>
            <p className="text-gray-300 text-sm line-clamp-3">
              {e.DescripcionEvento}
            </p>
          </div>

          {/* Checkbox */}
          <div className="ml-4 mt-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={seleccionados.includes(e._id)}
                onChange={() => toggleSeleccion(e._id)}
                className="form-checkbox h-5 w-5 text-yellow-500 rounded"
              />
            </label>
          </div>
        </div>
      ))}

      <button
        onClick={guardar}
        className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-full transition"
      >
        Guardar Configuración
      </button>
    </div>
  );
}
