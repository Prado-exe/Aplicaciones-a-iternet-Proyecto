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
          fetch("http://localhost:5000/api/Eventos"),       // lista completa de eventos
          fetch("http://localhost:5000/api/talleres/config") // configuración guardada
        ]);

        if (!tRes.ok) throw new Error(`Error talleres: ${tRes.status}`);
        if (!cfgRes.ok) throw new Error(`Error config: ${cfgRes.status}`);

        const t = await tRes.json();
        const cfg = await cfgRes.json();

        setTalleres(Array.isArray(t) ? t : []);
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
    <div>
      <h2>Configurar Talleres</h2>
      {Array.isArray(talleres) && talleres.map(t => (
        <div key={t._id}>
          <input
            type="checkbox"
            checked={seleccionados.includes(t._id)}
            onChange={() => toggleSeleccion(t._id)}
          />
          {t.NombreEvento} {/* usamos NombreEvento porque el modelo es Evento */}
        </div>
      ))}
      <button onClick={guardar}>
        Guardar Configuración
      </button>
    </div>
  );
}
