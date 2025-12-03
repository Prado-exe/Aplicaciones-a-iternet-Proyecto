import React, { useState } from "react";

export default function CrearEvento() {
  const [formData, setFormData] = useState({
    NombreEvento: "",
    TipoEvento: 1, // Por defecto Taller
    FechaEvento: "",
    DescripcionEvento: "",
    CuposEventos: {
      CantidadCupos: null, // Se inicializa a null (sin valor)
      IDR_Inscritos: [],
    },
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  
  // Estado para controlar la visibilidad del modal de confirmación
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Manejar inputs normales
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "CantidadCupos") {
      // Si el input está vacío, guarda null. De lo contrario, guarda el número.
      const numericValue = value === "" ? null : Number(value);
      setFormData({
        ...formData,
        CuposEventos: {
          ...formData.CuposEventos,
          CantidadCupos: numericValue,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen.");
      return;
    }

    setImageFile(file);
    setImagePreview({
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
    });
    setError("");
  };

  // NUEVA FUNCIÓN: Permite al usuario eliminar la imagen seleccionada
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    // Opcionalmente, resetear el valor del input file para que pueda volver a subir el mismo archivo
    // Esto requiere una referencia al input file, pero es más fácil simplemente resetear los estados.
  };

  // Función que inicia el proceso de envío: valida y abre el modal
  const enviarEvento = () => {
    setMensaje("");
    setError("");

    // Validación de campos obligatorios
    if (!formData.NombreEvento) {
        setError("El Nombre del Evento es obligatorio.");
        return;
    }
    if (!formData.FechaEvento) {
        setError("La Fecha y Hora del Evento es obligatoria.");
        return;
    }
    if (!formData.DescripcionEvento) {
        setError("La Descripción del Evento es obligatoria.");
        return;
    }
    
    // Validación específica de Cupos: debe ser un número y mayor a cero.
    const cupos = formData.CuposEventos.CantidadCupos;
    if (cupos === null || typeof cupos !== 'number' || cupos <= 0) {
        setError("La Cantidad de Cupos es obligatoria y debe ser un número mayor a cero.");
        return;
    }
    
    // Abre el modal de confirmación
    setIsModalOpen(true);
  };
  
  // Función que se ejecuta al confirmar el envío en el modal
  const handleConfirmSend = async () => {
    setIsModalOpen(false); // Cierra el modal

    setMensaje("");
    setError("");

    try {
      // NOTA IMPORTANTE: La verificación de duplicidad debe ser manejada en el
      // backend (/api/eventos/crear) para asegurar la unicidad.

      const token = localStorage.getItem("token");
      const formToSend = new FormData();

      // Campos simples
      formToSend.append("NombreEvento", formData.NombreEvento);
      formToSend.append("TipoEvento", formData.TipoEvento);
      formToSend.append("FechaEvento", formData.FechaEvento);
      formToSend.append("DescripcionEvento", formData.DescripcionEvento);

      formToSend.append(
        "CuposEventos",
        JSON.stringify(formData.CuposEventos)
      );
      // Se envía el campo Actividades como un array vacío
      formToSend.append(
        "Actividades",
        JSON.stringify([])
      );

      if (imageFile) {
        formToSend.append("imagenFile", imageFile);
      }

      const res = await fetch("/api/eventos/crear", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formToSend,
      });

      const data = await res.json();

      // Manejo de errores del backend (incluyendo duplicados)
      if (!res.ok) {
        if (data.error && data.error.includes("duplicado")) {
          throw new Error(
            `El servidor rechazó el evento: ${data.error}. Modifica el Nombre, la Fecha o la Descripción.`
          );
        }
        throw new Error(data.error || "Error al crear evento");
      }

      setMensaje("✔ Evento creado con éxito");

      // Reset de formulario
      setFormData({
        NombreEvento: "",
        TipoEvento: 1,
        FechaEvento: "",
        DescripcionEvento: "",
        // Se resetea a null para que inicie vacío
        CuposEventos: { CantidadCupos: null, IDR_Inscritos: [] }, 
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-[#1b1b1f] p-8 rounded-2xl text-yellow-200 w-full shadow-2xl border border-yellow-500/30 space-y-8">
      <h2 className="text-4xl font-extrabold mb-4 text-center text-yellow-400">
        Crear Nuevo Evento
      </h2>

      {/* Mensajes */}
      {mensaje && (
        <p className="text-green-400 p-3 rounded bg-green-900/30 text-center font-medium">
          {mensaje}
        </p>
      )}
      {error && (
        <p className="text-red-400 p-3 rounded bg-red-900/30 text-center font-medium">
          {error}
        </p>
      )}

      {/* Sección Información del Evento */}
      <div className="bg-[#0f0f12] p-6 rounded-xl shadow-inner space-y-4 border border-gray-700">
        <h3 className="text-2xl font-bold mb-4 text-yellow-300">
          Detalles del Evento
        </h3>

        {/* Nombre del Evento */}
        <div className="space-y-1">
          <label htmlFor="NombreEvento" className="block text-sm font-medium text-gray-400">Nombre del Evento</label>
          <input
            id="NombreEvento"
            name="NombreEvento"
            value={formData.NombreEvento}
            onChange={handleChange}
            placeholder="Ej: Conferencia anual de tecnología"
            className="w-full p-3 rounded-lg bg-[#1a1a1d] text-yellow-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Tipo de Evento */}
          <div className="flex-1 space-y-1">
            <label htmlFor="TipoEvento" className="block text-sm font-medium text-gray-400">Tipo de Evento</label>
            <select
              id="TipoEvento"
              name="TipoEvento"
              value={formData.TipoEvento}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1a1a1d] text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none cursor-pointer transition duration-200"
            >
              <option value={1}>Taller </option>
              <option value={2}>Evento </option>
            </select>
          </div>

          {/* Fecha y Hora */}
          <div className="flex-1 space-y-1">
            <label htmlFor="FechaEvento" className="block text-sm font-medium text-gray-400">Fecha y Hora</label>
            <input
              id="FechaEvento"
              type="datetime-local"
              name="FechaEvento"
              value={formData.FechaEvento}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1a1a1d] text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
            />
          </div>
        </div>

        {/* Descripción del Evento */}
        <div className="space-y-1">
          <label htmlFor="DescripcionEvento" className="block text-sm font-medium text-gray-400">Descripción Detallada</label>
          <textarea
            id="DescripcionEvento"
            name="DescripcionEvento"
            value={formData.DescripcionEvento}
            onChange={handleChange}
            rows={4}
            placeholder="Describe el contenido, objetivos y a quién está dirigido este evento."
            className="w-full p-3 rounded-lg bg-[#1a1a1d] text-yellow-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
          />
        </div>

        {/* Cantidad de Cupos */}
        <div className="space-y-1">
          <label htmlFor="CantidadCupos" className="block text-sm font-medium text-gray-400">Cantidad Máxima de Cupos (Mínimo 1)</label>
          <input
            id="CantidadCupos"
            type="number"
            name="CantidadCupos"
            // Usa una cadena vacía si es null para evitar que el input muestre '0'
            value={formData.CuposEventos.CantidadCupos === null ? '' : formData.CuposEventos.CantidadCupos}
            onChange={handleChange}
            placeholder="Ingrese un número mayor a cero"
            min="1"
            className="w-full p-3 rounded-lg bg-[#1a1a1d] text-yellow-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
          />
        </div>

        {/* Carga de Imagen */}
        <div>
          <label className="block text-sm mb-2 font-medium text-gray-400">
            Imagen del evento (opcional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-gray-300 block w-full
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-full file:border-0
                             file:text-sm file:font-semibold
                             file:bg-yellow-500 file:text-black
                             hover:file:bg-yellow-400 transition duration-200"
          />

          {imagePreview && (
            <div className="mt-3 flex items-center justify-between p-3 bg-[#1a1a1d] rounded-xl border border-yellow-500/10">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={imagePreview.url}
                    alt={imagePreview.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-gray-400 truncate max-w-[150px]">
                  {imagePreview.name}
                </p>
              </div>
              {/* BOTÓN PARA QUITAR LA IMAGEN */}
              <button
                onClick={handleRemoveImage}
                className="ml-4 p-2 text-sm bg-red-600 hover:bg-red-500 text-white rounded-full transition duration-200 flex-shrink-0"
                title="Quitar imagen actual"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Botón Crear Evento - Ahora abre el modal */}
      <button
        onClick={enviarEvento}
        className="w-full bg-green-600 hover:bg-green-500 text-black py-4 rounded-lg font-extrabold text-xl mt-4 shadow-xl transition duration-300 transform hover:scale-[1.01]"
      >
        Crear Evento y Enviar al Servidor
      </button>
      
      {/* Modal de Confirmación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1b1b1f] p-8 rounded-xl shadow-2xl max-w-sm w-full border border-yellow-500/50">
            <h3 className="text-xl font-bold mb-4 text-yellow-300">
              Confirmar Creación de Evento
            </h3>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que deseas crear el evento con la siguiente información?
            </p>
            <p className="text-sm font-semibold text-yellow-400 mb-2">
                {formData.NombreEvento}
            </p>
            <p className="text-sm text-gray-400 mb-4">
                Fecha: {new Date(formData.FechaEvento).toLocaleString()}
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSend}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-black rounded-lg font-bold transition duration-200"
              >
                Confirmar Envío
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}