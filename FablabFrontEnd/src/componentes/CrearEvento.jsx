import React, { useState } from "react";

export default function CrearEvento() {
  const [formData, setFormData] = useState({
    NombreEvento: "",
    TipoEvento: 1,
    FechaEvento: "",
    DescripcionEvento: "",
    RutaImagenEvento: "",
    CuposEventos: {
      CantidadCupos: 0,
      IDR_Inscritos: []
    },
    Actividades: []
  });

  const [actividad, setActividad] = useState({
    TituloActividad: "",
    DescripcionActividad: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Manejar inputs normales
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "CantidadCupos") {
      setFormData({
        ...formData,
        CuposEventos: {
          ...formData.CuposEventos,
          CantidadCupos: Number(value),
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Manejar actividad individual
  const handleActividadChange = (e) => {
    const { name, value } = e.target;
    setActividad({ ...actividad, [name]: value });
  };

  const agregarActividad = () => {
    if (
      actividad.TituloActividad.trim() === "" ||
      actividad.DescripcionActividad.trim() === ""
    ) {
      setError("Completa los campos de actividad antes de agregar.");
      return;
    }

    setFormData({
      ...formData,
      Actividades: [...formData.Actividades, actividad],
    });

    setActividad({ TituloActividad: "", DescripcionActividad: "" });
    setError("");
  };

  // Enviar evento al backend
  const enviarEvento = async () => {
    setMensaje("");
    setError("");

    if (
      !formData.NombreEvento ||
      !formData.FechaEvento ||
      !formData.DescripcionEvento
    ) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/eventos/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al crear evento");

      setMensaje("✔ Evento creado con éxito");
      setFormData({
        NombreEvento: "",
        TipoEvento: 1,
        FechaEvento: "",
        DescripcionEvento: "",
        RutaImagenEvento: "",
        CuposEventos: { CantidadCupos: 0, IDR_Inscritos: [] },
        Actividades: [],
      });

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#1b1b1f] p-6 rounded-2xl text-yellow-200 w-full shadow-lg border border-yellow-500/30">

      <h2 className="text-2xl font-bold mb-4">Crear Nuevo Evento</h2>

      {/* Mensajes */}
      {mensaje && <p className="text-green-400 mb-2">{mensaje}</p>}
      {error && <p className="text-red-400 mb-2">{error}</p>}

      {/* Nombre */}
      <label className="block mb-2">Nombre del evento</label>
      <input
        name="NombreEvento"
        value={formData.NombreEvento}
        onChange={handleChange}
        className="w-full p-2 rounded bg-[#0f0f12] text-yellow-200 mb-4"
        placeholder="Ej: Taller de Arduino"
      />

      {/* Tipo */}
      <label className="block mb-2">Tipo de evento</label>
      <select
        name="TipoEvento"
        value={formData.TipoEvento}
        onChange={handleChange}
        className="w-full p-2 rounded bg-[#0f0f12] text-yellow-200 mb-4"
      >
        <option value={1}>Tipo 1</option>
        <option value={2}>Tipo 2</option>
        <option value={3}>Tipo 3</option>
      </select>

      {/* Fecha */}
      <label className="block mb-2">Fecha del evento</label>
      <input
        type="datetime-local"
        name="FechaEvento"
        value={formData.FechaEvento}
        onChange={handleChange}
        className="w-full p-2 rounded bg-[#0f0f12] text-yellow-200 mb-4"
      />

      {/* Descripción */}
      <label className="block mb-2">Descripción</label>
      <textarea
        name="DescripcionEvento"
        value={formData.DescripcionEvento}
        onChange={handleChange}
        className="w-full p-2 rounded bg-[#0f0f12] text-yellow-200 mb-4"
        rows={4}
        placeholder="Describe el evento (objetivos, contenido, etc.)"
      />

      {/* Imagen */}
      <label className="block mb-2">URL de Imagen</label>
      <input
        name="RutaImagenEvento"
        value={formData.RutaImagenEvento}
        onChange={handleChange}
        className="w-full p-2 rounded bg-[#0f0f12] text-yellow-200 mb-4"
        placeholder="https://imagen.com/evento.jpg"
      />

      {/* Cupos */}
      <label className="block mb-2">Cantidad de cupos</label>
      <input
        type="number"
        name="CantidadCupos"
        value={formData.CuposEventos.CantidadCupos}
        onChange={handleChange}
        className="w-full p-2 rounded bg-[#0f0f12] text-yellow-200 mb-4"
      />

      {/* Actividades */}
      <h3 className="text-xl font-bold mt-4 mb-2">Agregar Actividades</h3>

      <label className="block mb-1">Título de la actividad</label>
      <input
        name="TituloActividad"
        value={actividad.TituloActividad}
        onChange={handleActividadChange}
        className="w-full p-2 rounded bg-[#0f0f12] text-yellow-200 mb-2"
      />

      <label className="block mb-1">Descripción de la actividad</label>
      <input
        name="DescripcionActividad"
        value={actividad.DescripcionActividad}
        onChange={handleActividadChange}
        className="w-full p-2 rounded bg-[#0f0f12] text-yellow-200 mb-2"
      />

      <button
        onClick={agregarActividad}
        className="bg-yellow-600 hover:bg-yellow-500 text-black px-3 py-2 rounded mb-4"
      >
        + Agregar Actividad
      </button>

      {/* Lista de actividades */}
      {formData.Actividades.length > 0 && (
        <div className="mt-2 mb-4">
          <h4 className="font-bold">Actividades agregadas:</h4>
          <ul className="list-disc ml-6">
            {formData.Actividades.map((a, i) => (
              <li key={i}>{a.TituloActividad}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Botón final */}
      <button
        onClick={enviarEvento}
        className="w-full bg-green-600 hover:bg-green-500 text-black py-3 rounded-lg font-bold mt-4"
      >
        Crear Evento
      </button>
    </div>
  );
}
