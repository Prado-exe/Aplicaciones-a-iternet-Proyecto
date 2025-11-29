import React, { useEffect, useState } from "react";

export default function AdminEventos() {
  const [eventos, setEventos] = useState([]);
  const [config, setConfig] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eRes, cfgRes] = await Promise.all([
          fetch("http://localhost:5000/api/eventos"),       // lista completa de eventos
          fetch("http://localhost:5000/api/eventos/config") // configuración guardada
        ]);

        if (!eRes.ok) throw new Error(`Error eventos: ${eRes.status}`);
        if (!cfgRes.ok) throw new Error(`Error config: ${cfgRes.status}`);

        const e = await eRes.json();
        const cfg = await cfgRes.json();

        setEventos(Array.isArray(e) ? e : []);
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

  return (
    <div>
      <h2>Configurar Eventos</h2>
      {Array.isArray(eventos) && eventos.map(e => (
        <div key={e._id}>
          <input
            type="checkbox"
            checked={seleccionados.includes(e._id)}
            onChange={() => toggleSeleccion(e._id)}
          />
          {e.NombreEvento} {/* asumimos que el modelo Evento tiene NombreEvento */}
        </div>
      ))}
      <button onClick={guardar}>
        Guardar Configuración
      </button>
    </div>
  );
}
