import React, { useEffect, useState } from "react";

export default function AdminTalleres() {
  const [talleres, setTalleres] = useState([]);
  const [config, setConfig] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tRes, cfgRes] = await Promise.all([
          fetch("http://localhost:5000/api/eventos"), // lista completa de eventos
          fetch("http://localhost:5000/api/talleres/config") // configuración guardada
        ]);

        if (!tRes.ok) throw new Error(`Error talleres: ${tRes.status}`);
        if (!cfgRes.ok) throw new Error(`Error config: ${cfgRes.status}`);

        const t = await tRes.json();
        const cfg = await cfgRes.json();

        // Filtramos solo los talleres (TipoEvento === 1)
        const soloTalleres = Array.isArray(t) ? t.filter(ev => ev.TipoEvento === 1) : [];

        setTalleres(soloTalleres);
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
      const res = await fetch("http://localhost:5000/api/talleres/config", {
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">Configurar Talleres</h2>

      {talleres.map(t => (
        <div
          key={t._id}
          className={`flex items-start bg-[#1b1b1f] border rounded-xl p-4 shadow-md hover:shadow-lg transition
            ${seleccionados.includes(t._id) ? "border-yellow-400" : "border-yellow-500/20"}`}
        >
          {/* Imagen a la izquierda */}
          <img
            src={t.RutaImagenEvento}
            alt={t.NombreEvento}
            className="w-24 h-24 object-cover rounded-lg mr-4 flex-shrink-0"
          />

          {/* Datos del taller */}
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
          <div className="ml-4 mt-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={seleccionados.includes(t._id)}
                onChange={() => toggleSeleccion(t._id)}
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
