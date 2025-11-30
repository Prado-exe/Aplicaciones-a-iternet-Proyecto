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
    <div className="bg-[#1b1b1f] p-6 rounded-2xl text-yellow-200 w-full shadow-lg border border-yellow-500/30 space-y-6">

    <h2 className="text-3xl font-bold mb-4 text-center">Crear Nuevo Evento</h2>

    {/* Mensajes */}
    {mensaje && <p className="text-green-400 mb-2 text-center">{mensaje}</p>}
    {error && <p className="text-red-400 mb-2 text-center">{error}</p>}

    {/* Sección Información del Evento */}
    <div className="bg-[#0f0f12] p-4 rounded-xl shadow-inner space-y-4">
      <h3 className="text-xl font-semibold mb-2">Información del Evento</h3>

      <input
        name="NombreEvento"
        value={formData.NombreEvento}
        onChange={handleChange}
        placeholder="Nombre del evento"
        className="w-full p-3 rounded-lg bg-[#1a1a1d] text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />

      <div className="flex gap-4">
        <select
          name="TipoEvento"
          value={formData.TipoEvento}
          onChange={handleChange}
          className="flex-1 p-3 rounded-lg bg-[#1a1a1d] text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value={1}>Taller</option>
          <option value={2}>Evento</option>
        </select>

        <input
          type="datetime-local"
          name="FechaEvento"
          value={formData.FechaEvento}
          onChange={handleChange}
          className="flex-1 p-3 rounded-lg bg-[#1a1a1d] text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <textarea
        name="DescripcionEvento"
        value={formData.DescripcionEvento}
        onChange={handleChange}
        rows={4}
        placeholder="Descripción del evento"
        className="w-full p-3 rounded-lg bg-[#1a1a1d] text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />

      <input
        name="RutaImagenEvento"
        value={formData.RutaImagenEvento}
        onChange={handleChange}
        placeholder="URL de la imagen"
        className="w-full p-3 rounded-lg bg-[#1a1a1d] text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />

      <input
        type="number"
        name="CantidadCupos"
        value={formData.CuposEventos.CantidadCupos}
        onChange={handleChange}
        placeholder="Cantidad de cupos"
        className="w-full p-3 rounded-lg bg-[#1a1a1d] text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
    </div>

    {/* Botón Crear Evento */}
    <button
      onClick={enviarEvento}
      className="w-full bg-green-600 hover:bg-green-500 text-black py-3 rounded-lg font-bold mt-2"
    >
      Crear Evento
    </button>
  </div>

  );
}
